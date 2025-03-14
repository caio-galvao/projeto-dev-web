import { Request, Response } from 'express';
import { comparePassword, generateToken } from '../utils/auth';
import { User } from '../models/User';

export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    
    try {
        // Verifica se o usuário existe
        const user = await User.findOne({ where: { name: username } });
        
        if (!user) {
            res.status(400).json({ message: 'Invalid username or password' });
            return;
        }

        // Compara a senha fornecida com a senha armazenada
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid username or password' });
            return;
        }

        // Gera um token JWT
        const token = generateToken(user.id, user.name);
        
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err });
    }
};