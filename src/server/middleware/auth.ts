import { Request, Response, NextFunction } from 'express';
import { jwtVerify, createRemoteJWKSet, JWTPayload } from 'jose';
import { AppError } from '../../types/errors';

type DecodedToken = JWTPayload & {
	sub: string;
	userId?: string | number;
	entityId?: string;
	schoolId?: string;
	email?: string;
	role?: string;
	realm_access?: {
		roles: string[];
	};
	resource_access?: {
		[clientId: string]: {
			roles: string[];
		};
	};
}

const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL;
const AUTH_REALM = process.env.AUTH_REALM;
const AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID;

if (!AUTH_SERVER_URL || !AUTH_REALM || !AUTH_CLIENT_ID) {
	throw new Error('Missing required auth environment variables: AUTH_SERVER_URL, AUTH_REALM, AUTH_CLIENT_ID');
}

const jwksUri = `${AUTH_SERVER_URL}/realms/${AUTH_REALM}/protocol/openid-connect/certs`;
//fetch and cache jwks from keycloak server
const JWKS = createRemoteJWKSet(new URL(jwksUri));

async function validateToken(token: string): Promise<DecodedToken> {
	const { payload } = await jwtVerify(token, JWKS, {
		issuer: `${AUTH_SERVER_URL}/realms/${AUTH_REALM}`,
		audience: AUTH_CLIENT_ID,
	});
	return payload as DecodedToken;
}

export function protect(...roles: string[]) {
	return [
		// Validate token
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const authHeader = req.headers.authorization;
				if (!authHeader?.startsWith('Bearer ')) {
					return next(new AppError('No token provided', 401, 'Unauthorized'));
				}
				const token = authHeader.slice(7);
				const payload = await validateToken(token);
				req.user = {
					userId: String(payload.userId ?? payload.sub),
					schoolId: String(payload.schoolId ?? ''),
					entityId: String(payload.entityId ?? ''),
					roles: payload.role ? [payload.role] : []
				};
				next();
			} catch (err) {
				console.log('Token verification error', { error: err });
				return next(new AppError('Invalid or expired token', 401, 'Unauthorized'));
			}
		},
		// Check roles and schoolId
		(req: Request, res: Response, next: NextFunction) => {
			const user = req.user;
			if (!user || !user.roles) {
				return next(new AppError('Invalid token', 401, 'Unauthorized'));
			}
			if (roles.length && !roles.some(role => user.roles.includes(role))) {
				return next(new AppError('Forbidden', 403, 'Forbidden'));
			}
			if (req.params && req.params.schoolId && user.schoolId && req.params.schoolId !== user.schoolId) {
				return next(new AppError('Forbidden: schoolId mismatch', 403, 'Forbidden'));
			}
			next();
		}
	];
}
