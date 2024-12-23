import { Button, Card, Col, Form, Input, notification, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '../../store/profile.store'; // Assume this function sets the access token
import { request } from '../../utils/helper'; // Assume this function handles API requests
import './LoginPage.css'; // Import the custom CSS file

const { Title } = Typography;

export default function LoginPage() {
    const navigate = useNavigate();

    const onLogin = async (values) => {
        try {
            const res = await request('auth/login', 'POST', values);
            if (res && !res.error) {
                // Store access token
                setAccessToken(res.data.access_token);
                // Store account type
                localStorage.setItem('account_type', res.data.account_type);
                // Store username (adjust based on your backend response)
                localStorage.setItem('username', res.data.username || 'User');
                // Redirect based on role
                const routes = {
                    superadmin: '/home',
                    admin: '/home',
                    user: '/dashboard'
                };
                navigate(routes[res.data.account_type] || '/dashboard');
                notification.success({
                    message: 'Login Successful',
                    description: 'You have successfully logged in.',
                    placement: 'topRight',
                });
            } else {
                notification.error({
                    message: 'Login Failed',
                    description: res.message || 'An error occurred during login.',
                    placement: 'topRight',
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            notification.error({
                message: 'Login Failed',
                description: 'An unexpected error occurred.',
                placement: 'topRight',
            });
        }
    };

    return (
        <div className="login-page">
            <Col xs={24} sm={24} md={12} lg={8} style={{ padding: '20px' }}>
                <div className="glass-effect">
                    <Card className="login-card" bordered={false}>
                        <Title level={2} style={{ textAlign: 'center', color: '#000', marginBottom: '20px' }}>
                            Welcome
                        </Title>
                        <Form
                            name="login_form"
                            initialValues={{ remember: true }}
                            onFinish={onLogin}
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input className="input-field" placeholder="Username" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password className="input-field" placeholder="Password" />
                            </Form.Item>

                            <Form.Item style={{ textAlign: 'center' }}>
                                <Button type="primary" htmlType="submit" block className="login-button">
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </Col>
        </div>
    );
}