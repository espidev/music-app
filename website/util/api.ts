import jwt from 'jsonwebtoken';
import { cookies } from 'next/dist/client/components/headers';

// check JWT token for validity
// return the uuid in the JWT token, or null if invalid
export async function checkAuthenticated() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  let decode: any;
  
  try {
    decode = await verifyToken(token, process.env.JWT_KEY!);
  } catch (err) {
    return null;
  }

  return decode.uuid;
}

async function verifyToken(token: any, key: any) {
  if (!token) return {};
  return new Promise((resolve, reject) => {
    jwt.verify(token, key, (err: any, decoded: any) => err ? reject({}) : resolve(decoded));
  })
}