import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Typography,
    Button,
    Descriptions,
    Tag,
    Divider,
    Timeline,
    Image,
    Spin,
    message,
    Space,
    Tooltip
} from 'antd';
import {
    ShoppingOutlined,
    ArrowLeftOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    EnvironmentOutlined,
    DollarOutlined
} from '@ant-design/icons';
import { getOrder, cancelOrder } from '../../api/order.ts';
import { getMyCurrency } from '../../api/profile.ts';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState(null);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const [orderResponse, currencyResponse] = await Promise.all([
                getOrder(id),
                getMyCurrency()
            ]);
            setOrder(orderResponse.data);
            setCurrency(currencyResponse.data);
        } catch (error) {
            message.error('Failed to fetch order details');
            navigate('/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        try {
            await cancelOrder(id);
            message.success('Order cancelled successfully');
            fetchOrderDetails();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to cancel order');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'processing',
            'Completed': 'success',
            'Cancelled': 'error'
        };
        return colors[status] || 'default';
    };

    const getPriceDisplay = (price) => {
        if (!price) return '0.00';
        const convertedPrice = price * (currency?.rate || 1);
        return `${currency?.code || '$'} ${convertedPrice.toFixed(2)}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spin size="large" tip="Loading order details..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <Card className="shadow-lg rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/orderHistory')}
                            className="text-indigo-600 hover:text-indigo-800"
                        >
                            Back to Orders
                        </Button>
                        {order?.status === 'Pending' && (
                            <Button danger onClick={handleCancelOrder}>
                                Cancel Order
                            </Button>
                        )}
                    </div>

                    <Title level={4} className="text-indigo-900 flex items-center gap-2">
                        <ShoppingOutlined />
                        Order #{order?._id.slice(-6)}
                    </Title>

                    {currency && (
                        <Text className="text-gray-500 block mb-4">
                            Prices shown in {currency.code} (1 USD = {currency.rate} {currency.code})
                        </Text>
                    )}

                    <Descriptions column={1} className="mt-4">
                        <Descriptions.Item
                            label={<Text strong>Status</Text>}
                        >
                            <Tag color={getStatusColor(order?.status)}>
                                {order?.status}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={<Text strong>Order Date</Text>}
                        >
                            {dayjs(order?.createdAt).format('MMMM D, YYYY h:mm A')}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Order Items */}
                <Card
                    title={
                        <Text strong className="text-indigo-900">Order Items</Text>
                    }
                    className="shadow-lg rounded-lg mb-6"
                >
                    {order?.products.map((item, index) => (
                        <div key={index}>
                            <div className="flex items-center gap-4 py-4">
                                <Image
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    width={80}
                                    height={80}
                                    className="rounded-lg object-cover"
                                    fallback="data:image/png;base64,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"
                                />
                                <div className="flex-1">
                                    <Text strong className="text-indigo-900">
                                        {item.product.name}
                                    </Text>
                                    <div className="text-gray-500">
                                        Quantity: {item.quantity}
                                    </div>
                                    <div className="text-indigo-600 font-medium">
                                        <Tooltip title={`Original: $${item.price.toFixed(2)}`}>
                                            {getPriceDisplay(item.price)} × {item.quantity} =
                                            {getPriceDisplay(item.price * item.quantity)}
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                            {index < order.products.length - 1 && <Divider />}
                        </div>
                    ))}

                    <Divider />

                    <div className="flex justify-end">
                        <div className="text-right">
                            <div className="mb-2">
                                <Text className="text-gray-500 mr-4">Subtotal:</Text>
                                <Tooltip title={`Original: $${order?.totalPrice.toFixed(2)}`}>
                                    <Text strong>{getPriceDisplay(order?.totalPrice)}</Text>
                                </Tooltip>
                            </div>
                            <div className="text-lg">
                                <Text strong className="text-gray-500 mr-4">Total:</Text>
                                <Tooltip title={`Original: $${order?.totalPrice.toFixed(2)}`}>
                                    <Text strong className="text-indigo-600">
                                        {getPriceDisplay(order?.totalPrice)}
                                    </Text>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Delivery Details */}
                <Card
                    title={
                        <Text strong className="text-indigo-900">
                            <EnvironmentOutlined className="mr-2" />
                            Delivery Information
                        </Text>
                    }
                    className="shadow-lg rounded-lg mb-6"
                >
                    <Descriptions column={1} className="mb-4">
                        <Descriptions.Item
                            label={<Text strong>Delivery Address</Text>}
                        >
                            <Text>{order?.deliveryAddress}</Text>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Order Timeline */}
                <Card
                    title={
                        <Text strong className="text-indigo-900">
                            <ClockCircleOutlined className="mr-2" />
                            Order Timeline
                        </Text>
                    }
                    className="shadow-lg rounded-lg"
                >
                    <Timeline mode="left">
                        <Timeline.Item
                            color="blue"
                            dot={<ShoppingOutlined className="text-indigo-600" />}
                        >
                            <Text strong>Order Placed</Text>
                            <div className="text-gray-500">
                                {dayjs(order?.createdAt).format('MMMM D, YYYY h:mm A')}
                            </div>
                            <div className="text-indigo-600">
                                Total Amount: {getPriceDisplay(order?.totalPrice)}
                            </div>
                        </Timeline.Item>

                        {order?.status === 'Completed' && (
                            <Timeline.Item
                                color="green"
                                dot={<CheckCircleOutlined className="text-green-600" />}
                            >
                                <Text strong>Order Completed</Text>
                                <div className="text-gray-500">
                                    Order has been successfully delivered
                                </div>
                            </Timeline.Item>
                        )}

                        {order?.status === 'Cancelled' && (
                            <Timeline.Item
                                color="red"
                                dot={<CloseCircleOutlined className="text-red-600" />}
                            >
                                <Text strong>Order Cancelled</Text>
                                <div className="text-gray-500">
                                    Order has been cancelled
                                </div>
                                {order?.paymentMethod === 'wallet' && (
                                    <div className="text-green-600">
                                        Refunded Amount: {getPriceDisplay(order?.totalPrice)}
                                    </div>
                                )}
                            </Timeline.Item>
                        )}
                    </Timeline>
                </Card>

                {/* Payment Information */}
                <Card
                    title={
                        <Text strong className="text-indigo-900">
                            <DollarOutlined className="mr-2" />
                            Payment Information
                        </Text>
                    }
                    className="shadow-lg rounded-lg mt-6"
                >
                    <Descriptions column={1}>
                        <Descriptions.Item
                            label={<Text strong>Payment Method</Text>}
                        >
                            <Tag color="blue">
                                {order.paymentMethod}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={<Text strong>Payment Status</Text>}
                        >
                            <Tag color={order?.status === 'Completed' ? 'green' : 'gold'}>
                                {order?.status === 'Completed' ? 'Paid' : 'Pending'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={<Text strong>Amount</Text>}
                        >
                            <Tooltip title={`Original: $${order?.totalPrice.toFixed(2)}`}>
                                <Text strong className="text-indigo-600">
                                    {getPriceDisplay(order?.totalPrice)}
                                </Text>
                            </Tooltip>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-between mt-6">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/orders')}
                        size="large"
                        className="text-indigo-600 hover:text-indigo-800"
                    >
                        Back to Orders
                    </Button>
                    {order?.status === 'Pending' && (
                        <Button
                            danger
                            size="large"
                            icon={<CloseCircleOutlined />}
                            onClick={handleCancelOrder}
                        >
                            Cancel Order
                        </Button>
                    )}
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx global>{`
                .ant-card-head-title {
                    font-size: 1.1rem;
                    color: #312e81;
                }

                .ant-timeline-item-tail {
                    border-left: 2px solid #e5e7eb;
                }

                .ant-timeline-item-head {
                    background: #ffffff;
                }

                .ant-descriptions-item-label {
                    color: #6b7280;
                }

                .ant-tag {
                    border-radius: 4px;
                    padding: 4px 8px;
                }

                .ant-btn-dangerous {
                    background: #fee2e2;
                    border-color: #ef4444;
                    color: #ef4444;
                }

                .ant-btn-dangerous:hover {
                    background: #fecaca;
                    border-color: #dc2626;
                    color: #dc2626;
                }

                .ant-card {
                    border-radius: 8px;
                }

                .ant-card-head {
                    border-bottom: 2px solid #e5e7eb;
                }

                .ant-timeline {
                    padding: 16px;
                }

                .ant-tooltip {
                    max-width: 300px;
                }
            `}</style>
        </div>
    );
};

export default OrderDetails;