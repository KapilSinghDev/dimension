import * as jwt from "jsonwebtoken";
export const getDecodedToken = () => {
  const token = localStorage.findItem("TOKEN");
  const decodeToken = jwt.decode(token);
  return decodeToken;
};
// const decodetoken = jwt.decode(token);
