import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Tag,
  Space,
  List,
  Rate,
  Skeleton,
  Row,
  Col,
  Statistic,
  Avatar,
  Alert,
  Badge,
  Button,
  message,
} from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  TagOutlined,
  PercentageOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ShareAltOutlined,
  CopyOutlined, MailOutlined,
} from "@ant-design/icons";
import MapContainer from "../shared/GoogleMaps/GoogleMaps";
import { TActivity } from "../../types/Activity/Activity";
import StaticMap from "../shared/GoogleMaps/ViewLocation";
import { getActivity } from "../../api/activity.ts";
import {getMyCurrency} from "../../api/profile.ts";

const { Title, Text } = Typography;

const ActivityDetails: React.FC = () => {
  const { id: ActivityId } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<TActivity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [currency, setCurrency] = useState(null);

  const fetchCurrency = async () => {
    try {
      const response = await getMyCurrency();
      setCurrency(response.data);
      console.log("Currency:", response.data);
    } catch (error) {
      console.error("Fetch currency error:", error);
    }
  }


  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const response = await getActivity(ActivityId ?? -1);
        if (![200, 201].includes(response.status))
          throw new Error("Failed to fetch activity");
        setActivity(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrency();
    if (ActivityId) fetchActivity();
  }, [ActivityId]);

  if (loading) return <Skeleton active />;
  if (error) return <Alert type="error" message={error} />;
  if (!activity) return <Alert type="warning" message="Activity not found" />;
// hello
  const averageRating =
      activity.ratings.length > 0
          ? Number(
              (
                  activity.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
                  activity.ratings.length
              ).toFixed(1)
          )
          : 0;

  const handleShareEmail = () => {
    const subject = `Check out this activity: ${activity?.name}`;
    const body = `
      Activity Details:
      - Name: ${activity?.name}
      - Date: ${new Date(activity?.date).toLocaleDateString()}
      - Time: ${activity?.time}
      - Location: ${
        activity?.location
            ? `Latitude: ${activity.location.lat}, Longitude: ${activity.location.lng}`
            : "Location not specified"
    }
      - Price Range: ${
        activity?.price?.min && activity?.price?.max
            ? `${currency?.code} ${(currency?.rate*activity.price.min).toFixed(2)} - ${(currency?.rate*activity.price.max).toFixed(2)}`
            : "Not specified"
    }
      - Category: ${activity?.category?.category || "No category"}
      - Tags: ${
        activity?.preferenceTags.length > 0
            ? activity.preferenceTags.map((tag) => tag.tag).join(", ")
            : "No tags"
    }

      Special Discounts:
      ${
        activity?.specialDiscounts.length > 0
            ? activity.specialDiscounts
                .map(
                    (discount, index) =>
                        `${index + 1}. ${discount.discount}% OFF - ${
                            discount.Description
                        } (${discount.isAvailable ? "Available" : "Not Available"})`
                )
                .join("\n")
            : "No special discounts"
    }

      Ratings:
      - Total Ratings: ${activity?.ratings.length}
      - Average Rating: ${
        activity?.ratings.length
            ? (
                activity.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
                activity.ratings.length
            ).toFixed(1)
            : "No ratings yet"
    }

      More details and booking: ${window.location.origin}/itinerary/activityDetails/${ActivityId}
    `;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(
        subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/itinerary/activityDetails/${ActivityId}`;
    navigator.clipboard.writeText(link).then(
        () => message.success("Link copied to clipboard!"),
        () => message.error("Failed to copy the link")
    );
  };

  const cardStyle = {
    borderRadius: "10px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    backgroundColor: "#FFFFFF",
    color: "#496989",
    cursor: "pointer",
  };

  const hoverCardStyle = {
    backgroundColor: "#E2F4C5", // hover color
    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
  };

  return (
    <div style={{ backgroundColor: "#496989", minHeight: "100vh", padding: "24px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%", margin: "0 auto" }}>

        {/* Header Section */}
        <Card
          style={{
            ...cardStyle,
            ...(hoveredCard === "header" ? hoverCardStyle : {}),
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '15px',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={() => setHoveredCard("header")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ color: "#3A6DAF", fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
                {activity.name}
              </Title>
              <Space size="small">
                <Badge
                  status={activity.isActive ? "success" : "error"}
                  text={activity.isActive ? "Active" : "Inactive"}
                />
                <Badge
                  status={activity.isBookingOpen ? "processing" : "default"}
                  text={activity.isBookingOpen ? "Booking Open" : "Booking Closed"}
                />
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" align="end">
                <Rate disabled value={averageRating} allowHalf />
                <Text type="secondary" style={{ color: "#7D8798" }}>
                  {activity.ratings.length} ratings
                </Text>
                <Space>
                  <Button
                    icon={<CopyOutlined />}
                    onClick={handleCopyLink}
                    style={{
                      backgroundColor: '#4A90E2',
                      color: 'white',
                      borderColor: 'transparent',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'background-color 0.3s, transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#357ABD'} // Darker blue on hover
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#4A90E2'} // Original blue color
                  >
                    Copy Link
                  </Button>
                  <Button
                    icon={<MailOutlined />}
                    onClick={handleShareEmail}
                    style={{
                      backgroundColor: '#4A90E2',
                      color: 'white',
                      borderColor: 'transparent',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'background-color 0.3s, transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#357ABD'} // Darker blue on hover
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#4A90E2'} // Original blue color
                  >
                    Share via Email
                  </Button>
                </Space>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Location and Basic Info Section */}
        <Row gutter={[24, 24]}>
          {/* Left Column - Basic Information */}
          <Col xs={24} lg={12}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <Card
                title="Basic Information"
                style={{
                  ...cardStyle,
                  ...(hoveredCard === "basicInfo" ? hoverCardStyle : {}),
                }}
                onMouseEnter={() => setHoveredCard("basicInfo")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Statistic
                      title={<Text style={{ color: "#58A399" }}>Date</Text>}
                      value={new Date(activity.date).toLocaleDateString()}
                      prefix={<CalendarOutlined />}
                      valueStyle={{ color: "#496989" }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title={<Text style={{ color: "#58A399" }}>Time</Text>}
                      value={activity.time}
                      prefix={<ClockCircleOutlined />}
                      valueStyle={{ color: "#496989" }}
                    />
                  </Col>
                  <Col span={24}>
                    <Statistic
                      title={<Text style={{ color: "#58A399" }}>Price Range</Text>}
                      value={
                        activity?.price?.min && activity?.price?.max
                            ? `${currency?.code} ${(currency?.rate*activity.price.min).toFixed(2)} - ${(currency?.rate*activity.price.max).toFixed(2)}`
                            : "Not specified"
                      }

                      prefix={<DollarOutlined />}
                      valueStyle={{ color: "#496989" }}
                    />
                  </Col>
                </Row>
              </Card>

              <Card
                title={<Space><TagOutlined style={{ color: "#58A399" }} /><span>Category & Tags</span></Space>}
                style={{
                  ...cardStyle,
                  ...(hoveredCard === "categoryTags" ? hoverCardStyle : {}),
                }}
                onMouseEnter={() => setHoveredCard("categoryTags")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Space direction="vertical">
                  <div>
                    <Text strong style={{ color: "#496989" }}>Category: </Text>
                    <Tag color="blue">{activity.category?.category}</Tag>
                  </div>
                  <div>
                    <Text strong style={{ color: "#496989" }}>Preference Tags: </Text>
                    <Space wrap>
                      {activity.preferenceTags.map((tag) => (
                        <Tag key={tag._id} color="green">
                          {tag.tag}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                </Space>
              </Card>
            </Space>
          </Col>

          {/* Right Column - Map */}
          <Col xs={24} lg={12}>
            <Card
              title={<Space><EnvironmentOutlined style={{ color: "#58A399" }} /><span>Location</span></Space>}
              bodyStyle={{ padding: 0, height: "400px" }}
              style={{
                ...cardStyle,
                overflow: "hidden",
                ...(hoveredCard === "location" ? hoverCardStyle : {}),
              }}
              onMouseEnter={() => setHoveredCard("location")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <StaticMap longitude={activity.location.lng} latitude={activity.location.lat} />
            </Card>
          </Col>
        </Row>

        {/* Special Discounts */}
        {activity.specialDiscounts.length > 0 && (
  <Card
    title={
      <Space>
        <PercentageOutlined style={{ color: "#58A399" }} />
        <span>Special Discounts</span>
      </Space>
    }
    style={{
      ...cardStyle,
      ...(hoveredCard === "specialDiscounts" ? hoverCardStyle : {}),
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Same box shadow as header
      borderRadius: '15px', // Same rounded corners
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease', // Smooth transition effect
      padding: '20px', // Padding for spacious layout
    }}
    onMouseEnter={() => setHoveredCard("specialDiscounts")}
    onMouseLeave={() => setHoveredCard(null)}
  >
    <List
      dataSource={activity.specialDiscounts}
      renderItem={(discount) => (
        <List.Item
          extra={
            discount.isAvailable ? (
              <Tag color="success" icon={<CheckCircleOutlined />}>
                Available
              </Tag>
            ) : (
              <Tag color="error" icon={<CloseCircleOutlined />}>
                Not Available
              </Tag>
            )
          }
        >
          <List.Item.Meta
            title={<Text style={{ color: "#58A399" }}>{`${discount.discount}% OFF`}</Text>}
            description={<Text style={{ color: "#496989" }}>{discount.Description}</Text>}
          />
        </List.Item>
      )}
    />
  </Card>
        )}

        {/* Comments */}
        {activity.comments.length > 0 && (
          <Card
            title={<Space><UserOutlined style={{ color: "#58A399" }} /><span>User Comments</span></Space>}
            style={{
              ...cardStyle,
              ...(hoveredCard === "comments" ? hoverCardStyle : {}),
            }}
            onMouseEnter={() => setHoveredCard("comments")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <List
              dataSource={activity.comments}
              renderItem={(comment) => (
                <List.Item>
                  {/*<List.Item.Meta*/}
                  {/*  avatar={<Avatar>{comment.user[0]}</Avatar>}*/}
                  {/*  title={<Text strong style={{ color: "#496989" }}>{comment.user}</Text>}*/}
                  {/*  description={<Text>{comment.text}</Text>}*/}
                  {/*/>*/}
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* Footer */}
        <Card
  size="small"
  style={{
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '15px',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  }}
  onMouseEnter={() => setHoveredCard("footer")}
  onMouseLeave={() => setHoveredCard(null)}
  className="text-center"
>
  <Space direction="vertical" size="small" style={{ textAlign: 'center' }}>
    <Text type="secondary" style={{ color: "#7D8798" }}>
    <strong>Created by:</strong> {activity.createdBy.username}
    </Text>
    <Text type="secondary" style={{ color: "#7D8798" }}>
      <strong>Created:</strong> {new Date(activity.createdAt).toLocaleDateString()}
    </Text>
    <Text type="secondary" style={{ color: "#7D8798" }}>
    <strong>Last updated:</strong> {new Date(activity.updatedAt).toLocaleDateString()}
    </Text>
  </Space>
        </Card>

      </Space>
    </div>
  );
};

export default ActivityDetails;
