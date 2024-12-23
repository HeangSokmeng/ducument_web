import {
    DownOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    QuestionCircleOutlined,
    TeamOutlined,
    UserDeleteOutlined,
    UsergroupDeleteOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Layout, Menu, Modal, theme } from "antd";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logoAdmin from "../../assets/admins/logoAdmin.png";
import userImg from "../../assets/admins/userImg.png";
import '../../index.css';
import styles from "./MainLayout.module.css";


const { Content, Footer, Sider } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const navigate = useNavigate();

    const userRole = localStorage.getItem("account_type");

    const getMenuItemsByRole = (role) => [
        {
            key: "home",
            icon: <HomeOutlined />,
            label: "Home",
            roles: ["superadmin", "admin"],
        },
        {
            key: "author",
            icon: <UsergroupDeleteOutlined />,
            label: "Author",
            roles: ["superadmin", "admin"],
        },
        {
            key: "user",
            icon: <UserDeleteOutlined />,
            label: "User",
            roles: ["superadmin"],
        },
        {
            key: "role",
            icon: <TeamOutlined />,
            label: "Role",
            roles: ["superadmin"],
        },
        {
            key: "category",
            icon: <TeamOutlined />,
            label: "Category",
            roles: ["superadmin"],
        },
        {
            key: "documentation",
            icon: <TeamOutlined />,
            label: "Documentation",
            roles: ["superadmin"],
        },

    ].filter((item) => !item.roles || item.roles.includes(role));
    const items = getMenuItemsByRole(userRole);
    const onClickMenu = (item) => {
        navigate(item.key);
        setMobileSidebarVisible(false);
    };

    const handleLogout = () => {
        Modal.confirm({
            title: (
                <div className="modal-header">
                    <QuestionCircleOutlined className="animated-icon" />
                    <div className="modal-title">Do you want to log out now?</div>
                </div>
            ),
            content: null,
            okText: "OK",
            cancelText: "Cancel",
            okButtonProps: { className: "ok-button" },
            cancelButtonProps: { className: "cancel-button" },
            onOk: () => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("account_type");
                navigate("/login");
            },
            onCancel: () => {
                console.log("Logout canceled");
            },
            centered: true,
            closable: false,
            className: "custom-modal",
        });
    };

    const dropdownMenuItems = [
        { key: "1", label: "Profile" },
        { key: "2", label: "Settings" },
        { key: "3", label: "Logout", onClick: handleLogout },
    ];

    const toggleMobileSidebar = () => {
        setMobileSidebarVisible(!mobileSidebarVisible);
    };

    // const defaultSelectedKey = location.pathname.split("/")[1] || "home";

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
                <div className={styles.header} style={{backgroundColor:'#0080ff'}}>
                    <div className={styles.headerContent}>
                        <div className={styles.logoContainer}>
                            <img src={logoAdmin} alt="Logo" className={styles.logo} />
                        </div>
                        <div className={styles.userSection}>
                            <Dropdown menu={{ items: dropdownMenuItems }} trigger={['click']}>
                                <div className={styles.userInfo}>
                                    <img src={userImg} alt="User" className={styles.userAvatar} />
                                    <div className={styles.userDetails}>
                                        <span>
                                            Welcome,
                                            {localStorage.getItem("username")}
                                        </span>
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
