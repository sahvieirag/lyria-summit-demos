
import React from 'react';
import { Link } from 'react-router-dom';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
  to: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, tag, to }) => {
  return (
    <Link to={to} className="block group">
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between hover:shadow-lg hover:border-blue-300 transition-all duration-300">
            <div className="flex items-center space-x-5">
                <div className="bg-blue-100/70 rounded-full p-3 group-hover:bg-blue-100 transition-colors">
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <p className="text-gray-500 text-sm">{description}</p>
                </div>
            </div>
            <div className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full hidden sm:block">
                {tag}
            </div>
        </div>
    </Link>
  );
};

export default ActionCard;
