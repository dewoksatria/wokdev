import React, { useState } from 'react';
import { Send, RefreshCw } from 'lucide-react';

interface ContactFormProps {
    className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [captcha, setCaptcha] = useState({ question: '', answer: 0, userAnswer: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Generate random simple math captcha
    const generateCaptcha = () => {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        setCaptcha({
            question: `What is ${num1} + ${num2}?`,
            answer: num1 + num2,
            userAnswer: ''
        });
    };

    // Initialize captcha on component mount
    React.useEffect(() => {
        generateCaptcha();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCaptcha(prev => ({ ...prev, userAnswer: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate captcha
        if (parseInt(captcha.userAnswer) !== captcha.answer) {
            setError('Incorrect captcha answer. Please try again.');
            generateCaptcha();
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Message sent successfully! I will get back to you soon.');
                setFormData({ name: '', email: '', message: '' });
                generateCaptcha();
            } else {
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send message');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
            {error && (
                <div className="p-4 text-sm border border-red-500/30 rounded-lg bg-red-500/10 text-red-400">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-4 text-sm border border-green-500/30 rounded-lg bg-green-500/10 text-green-400">
                    {success}
                </div>
            )}

            <div className="space-y-2">
                <label className="block text-sm font-mono text-green-400/80">
                    Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full !bg-black border !border-green-500/30 !rounded-lg p-3 !text-green-400 !placeholder-green-400/50 focus:!border-green-500 focus:!ring-1 focus:!ring-green-500 !transition-colors"
                    placeholder="John Doe"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-mono text-green-400/80">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full !bg-black border !border-green-500/30 !rounded-lg p-3 !text-green-400 !placeholder-green-400/50 focus:!border-green-500 focus:!ring-1 focus:!ring-green-500 !transition-colors"
                    placeholder="john@example.com"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-mono text-green-400/80">
                    Message
                </label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full !bg-black border !border-green-500/30 !rounded-lg p-3 !text-green-400 !placeholder-green-400/50 focus:!border-green-500 focus:!ring-1 focus:!ring-green-500 !transition-colors"
                    placeholder="Your message here..."
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-mono text-green-400/80">
                    {captcha.question}
                    <button
                        type="button"
                        onClick={generateCaptcha}
                        className="ml-2 text-green-400/60 hover:text-green-400 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 inline" />
                    </button>
                </label>
                <input
                    type="text"
                    value={captcha.userAnswer}
                    onChange={handleCaptchaChange}
                    required
                    className="w-full !bg-black border !border-green-500/30 !rounded-lg p-3 !text-green-400 !placeholder-green-400/50 focus:!border-green-500 focus:!ring-1 focus:!ring-green-500 !transition-colors"
                    placeholder="Enter the answer"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg p-3 hover:bg-green-500/30 transition-colors disabled:opacity-50"
            >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
            </button>
        </form>
    );
};

export default ContactForm;