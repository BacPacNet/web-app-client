import React from 'react';
import { MdEmail } from 'react-icons/md';
import { FaPhoneAlt, FaLink, FaClock } from 'react-icons/fa';
import { HiMiniPrinter } from 'react-icons/hi2';
import { TiHome } from 'react-icons/ti';

const ContactCard = ({ contactInfo }: { contactInfo: object }) => {
    const infoKeys = Object.keys(contactInfo);

    const renderContactInfo = () => {
        const contactItems = [];
        for (let i = 0; i < infoKeys.length; i += 3) {
            contactItems.push(
                <div key={i} className="border-2 border-gray rounded-lg p-2">
                    <ul className="flex flex-col gap-8 h-full">
                        {infoKeys.slice(i, i + 3).map((key, index) => (
                            <li className='h-1/3' key={index}>
                                <span className="flex flex-row items-center font-bold">
                                    {getIcon(key)} {formatKey(key)}
                                </span>
                                <span className="text-gray">{contactInfo[key as keyof typeof contactInfo]}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
        return contactItems;
    };

    const getIcon = (key: string) => {
        switch (key) {
            case 'email':
                return <MdEmail className="mx-1" size={20} />;
            case 'phone':
                return <FaPhoneAlt className="mx-1" size={20} />;
            case 'fax':
                return <HiMiniPrinter className="mx-1" size={20} />;
            case 'link':
                return <FaLink className="mx-1" size={20} />;
            case 'location':
                return <TiHome className="mx-1" size={20} />;
            case 'officeHours':
                return <FaClock className="mx-1" size={20} />;
            default:
                return null;
        }
    };

    const formatKey = (key: string) => {
        return key.charAt(0).toUpperCase() + key.slice(1);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {renderContactInfo()}
        </div>
    );
};

export default ContactCard;
