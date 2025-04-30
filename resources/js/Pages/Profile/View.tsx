import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
  Card,
  Descriptions,
  Avatar,
  Button,
  Divider,
  Typography,
  Skeleton,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import MainLayout from "@/Layouts/MainLayout";
import { useAuthUser, useAuthLoading } from "@/Stores/authStore";

const { Title } = Typography;

const ProfileView: React.FC = () => {
  const user = useAuthUser();
  const isLoading = useAuthLoading();

  if (isLoading || !user) {
    return (
      <MainLayout>
        <Head title="Profile" />
        <Card className="w-full max-w-4xl mx-auto">
          <Skeleton avatar paragraph={{ rows: 6 }} active />
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head title="Profile" />

      <div className="max-w-4xl mx-auto">
        <Card
          className="mb-8 overflow-hidden"
          title={
            <div className="flex justify-between items-center">
              <Title level={3}>My Profile</Title>
              <Link href="/profile/edit">
                <Button type="primary" icon={<EditOutlined />}>
                  Edit Profile
                </Button>
              </Link>
            </div>
          }
        >
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="flex flex-col items-center mb-6 md:mb-0">
              <Avatar
                size={120}
                src={user.avatar?.url || "/assets/default-avatar.png"}
                className="mb-4"
              />
              <Typography.Title level={4}>{user.fullname}</Typography.Title>
              {user.username && (
                <Typography.Text type="secondary">
                  @{user.username}
                </Typography.Text>
              )}
            </div>

            <Divider type="vertical" className="hidden md:block h-auto" />

            <div className="flex-1">
              <Descriptions
                layout="vertical"
                column={{ xs: 1, sm: 2 }}
                bordered
                size="middle"
              >
                <Descriptions.Item label="Email">
                  {user.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {user.phone || "Not provided"}
                </Descriptions.Item>

                {user.gender && (
                  <Descriptions.Item label="Gender">
                    {user.gender}
                  </Descriptions.Item>
                )}

                {user.dob && (
                  <Descriptions.Item label="Date of Birth">
                    {user.dob}
                  </Descriptions.Item>
                )}

                {user.address && (
                  <Descriptions.Item label="Address" span={2}>
                    {user.address}
                  </Descriptions.Item>
                )}

                {user.next_of_kin && (
                  <Descriptions.Item label="Next of Kin" span={2}>
                    {user.next_of_kin}
                  </Descriptions.Item>
                )}

                <Descriptions.Item label="Joined">
                  {new Date(user.created_at).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label="Email Verified">
                  {user.email_verified_at ? "Yes" : "No"}
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <div className="flex justify-center md:justify-end space-x-4">
                <Link href="/profile/edit">
                  <Button type="default">Edit Profile</Button>
                </Link>
                <Link href="/profile/edit?tab=password">
                  <Button>Change Password</Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProfileView;
