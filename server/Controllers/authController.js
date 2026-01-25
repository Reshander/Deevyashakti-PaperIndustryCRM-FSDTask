import Customer from '../models/Customer.js';

// Simulated OTP storage (in-memory for demo)
const otps = new Map();

export const login = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await Customer.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Email not registered' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otps.set(email, otp);

        console.log(`[OTP Simulation] OTP for ${email}: ${otp}`);

        res.json({
            message: 'OTP sent successfully (Simulated)',
            otp: otp // Sending OTP in response for testing convenience
        });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const storedOtp = otps.get(email);

    if (storedOtp && storedOtp === otp) {
        otps.delete(email);

        try {
            const user = await Customer.findOne({
                where: { email },
                attributes: ['id', 'name', 'email']
            });

            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: email.includes('admin') ? 'admin' : 'customer'
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Database error', error: error.message });
        }
    } else {
        res.status(401).json({ message: 'Invalid OTP' });
    }
};
