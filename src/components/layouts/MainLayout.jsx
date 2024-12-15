import {
    DownOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserDeleteOutlined,
    UsergroupDeleteOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import logoAdmin from '../../assets/admins/logoAdmin.png';
import userImg from '../../assets/admins/userImg.png';
import styles from './MainLayout.module.css';

const { Content, Footer, Sider } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const navigate = useNavigate();

    const items = [
        {
            key: "home",
            icon: <HomeOutlined />,
            label: 'Home',
        },
        {
            key: "user",
            icon: <UsergroupDeleteOutlined />,
            label: 'User',
        },
        {
            key: "author",
            icon: <UserDeleteOutlined />,
            label: 'author',
        },
    ];

    const onClickMenu = (item) => {
        navigate(item.key);
        setMobileSidebarVisible(false);
    };

    const dropdownMenuItems = [
        { key: '1', label: 'Profile' },
        { key: '2', label: 'Settings' },
        { key: '3', label: 'Logout' },
    ];

    const toggleMobileSidebar = () => {
        setMobileSidebarVisible(!mobileSidebarVisible);
    };

    return (
        <Layout className={styles.responsiveContainer}>
            <Button
                className={styles.sidebarToggle}
                onClick={toggleMobileSidebar}
            >
                {mobileSidebarVisible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            </Button>

            <Sider
                // collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                className={`${styles.sidebar} ${mobileSidebarVisible ? styles.mobileSidebarVisible : ''}`}
            >
                <div className="demo-logo-vertical">
                    <h1 className={styles.brandTitle}>Documents</h1>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['home']}
                    items={items}
                    onClick={onClickMenu}
                />
            </Sider>

            <Layout className={styles.mainContent}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.logoContainer}>
                            <img src={logoAdmin} alt="Logo" className={styles.logo} />
                        </div>
                        <div className={styles.userSection}>
                            <Dropdown menu={{ items: dropdownMenuItems }} trigger={['click']}>
                                <div className={styles.userInfo}>
                                    <img src={userImg} alt="User" className={styles.userAvatar} />
                                    <div className={styles.userDetails}>
                                        <span>Welcome, Sarana</span>
                                        <DownOutlined />
                                    </div>
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <Content className={styles.content}>
                    <div
                        style={{
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            minHeight: 500,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer className={styles.footer}>
                    Sarana Team © Document System 2025
                </Footer>
            </Layout>
        </Layout>
    );
};

export default MainLayout;