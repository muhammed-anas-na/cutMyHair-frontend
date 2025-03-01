import {
    Home, Users, Calendar, Briefcase,
    BarChart2, Bell, Settings, ChevronDown,
    Sun, Moon, MoreVertical, ChevronLeft, ChevronRight,
    TrendingUp, TrendingDown
} from 'lucide-react';

const StatsCard = ({ title, value, change, type, icon: Icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-start justify-between mb-4">
            <div>
                <h3 className="text-gray-600 mb-2">{title}</h3>
                <p className="text-2xl font-semibold">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${type === 'users' ? 'bg-blue-50' : type === 'orders' ? 'bg-yellow-50' : 'bg-green-50'}`}>
                <Icon className={type === 'users' ? 'text-blue-500' : type === 'orders' ? 'text-yellow-500' : 'text-green-500'} />
            </div>
        </div>
        <div className="flex items-center gap-2">
            {change.direction === 'up' ? (
                <TrendingUp className="text-green-500" size={16} />
            ) : (
                <TrendingDown className="text-red-500" size={16} />
            )}
            <span className={`text-sm ${change.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {change.value} {change.text}
            </span>
        </div>
    </div>
);

// Dashboard Content Component
const DashboardContent = () => {
    const stats = [
        {
            title: 'Total User',
            value: '40,689',
            change: { value: '8.5%', direction: 'up', text: 'Up from yesterday' },
            type: 'users',
            icon: Users
        },
        {
            title: 'Total Order',
            value: '10293',
            change: { value: '1.3%', direction: 'up', text: 'Up from past week' },
            type: 'orders',
            icon: Briefcase
        },
        {
            title: 'Total Sales',
            value: '$89,000',
            change: { value: '4.3%', direction: 'down', text: 'Down from yesterday' },
            type: 'sales',
            icon: BarChart2
        }
    ];

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>
        </div>
    );
};

export default DashboardContent;