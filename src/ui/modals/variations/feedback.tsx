import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader } from '../subcomponents';
import { Button, DefaultDropdown, DefaultInput, TransactionStatus } from '../../components';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { ThemeContext } from '../../../store/theme';

export const FeedbackDialog: React.FC<IDialogProps> = ({ name, isOpen, data, closeDialog }) => {
    const { isDark } = useContext(ThemeContext);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [form, setForm] = useState({ username: '', feature: '', message: '' });
    const [captcha, setCaptcha] = useState('');

    const updateForm = (key: 'username' | 'feature' | 'message', value: string) => {
        setForm({
            ...form,
            [key]: value,
        });
    };

    const handleSubmit = async () => {
        if (!validateCaptcha(captcha)) {
            setError('Captcha is incorrect. Please try again.');
            return;
        }
        setIsSending(true);
        fetch(
            `https://discord.com/api/webhooks/${process.env.REACT_APP_WEBHOOK_ID}/${process.env.REACT_APP_WEBHOOK_TOKEN}`,
            {
                method: 'POST',
                body: JSON.stringify({
                    content: 'Message Received',
                    embeds: [
                        {
                            title: form.feature,
                            description: form.message,
                            author: {
                                name: form.username || '',
                            },
                            timestamp: new Date().toISOString(),
                        },
                    ],
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            },
        )
            .then(() => {
                setIsSending(false);
                setIsSuccess(true);
                setForm({ username: '', feature: '', message: '' });
                setTimeout(() => {
                    setError('');
                    setIsSuccess(false);
                    closeDialog('feedback-dialog');
                }, 3000);
            })
            .catch((err) => {
                console.error(err.message);
                setIsSending(false);
                setTimeout(() => {
                    setError('');
                    setIsSuccess(false);
                }, 3000);
            });
    };

    useEffect(() => {
        loadCaptchaEnginge(6);
    }, []);

    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => setError(''), 3000);
            return () => clearTimeout(timeout);
        }
    }, [error]);

    return (
        <>
            <ModalHeader dialog={'feedback-dialog'} title={name} />
            {!isSuccess ? (
                <>
                    <div className="py-8 flex flex-col gap-4">
                        <div className="flex flex-col gap-4 md:flex-row justify-between">
                            <DefaultInput
                                title="Feature"
                                value={form.feature}
                                onType={(e: any) => updateForm('feature', e)}
                                size="lg"
                                placeholder="Markets Page"
                                required
                            />
                            <DefaultInput
                                title="Discord Username"
                                value={form.username}
                                onType={(e: any) => updateForm('username', e)}
                                size="lg"
                                placeholder="@vmexfinance#1234"
                            />
                        </div>
                        <DefaultInput
                            title="Message"
                            value={form.message}
                            onType={(e: any) => updateForm('message', e)}
                            size="lg"
                            placeholder="Start typing here..."
                            required
                        />
                    </div>
                    <div className="flex w-full justify-between items-end gap-4">
                        <LoadCanvasTemplate reloadColor={isDark ? '#6098e8' : '#7667db'} />
                        <DefaultInput
                            title="Captcha"
                            value={captcha}
                            onType={(e: any) => setCaptcha(e)}
                            size="lg"
                            placeholder="Enter letters here..."
                            required
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 break-words">{error || 'Invalid input'}</p>
                    )}
                </>
            ) : (
                <div className="mt-10 mb-8">
                    <TransactionStatus success={isSuccess} full />
                </div>
            )}

            <ModalFooter>
                <Button
                    primary
                    disabled={!form.feature || !form.message || !captcha}
                    onClick={handleSubmit}
                    label="Send Message"
                    loading={isSending}
                />
            </ModalFooter>
        </>
    );
};
