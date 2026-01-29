import { signupService, loginService } from "../../services/auth/service.js";

export async function signup(req, res, next) {
  try {
    const result = await signupService(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await loginService(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
