import React from 'react'
import './footer.css'
import Uiimg1 from '../../Assets/Images/app-download-img-left_s5n2zf.webp'
import Uiimg2 from '../../Assets/Images/app-download-img_c7xqg4.webp'
import { FaApple, FaHeart } from 'react-icons/fa6'
import Playstore from '../../Assets/Images/playstore.svg'
import { MdOutlineLocalShipping } from 'react-icons/md'
import { FiCreditCard, FiPhoneCall } from 'react-icons/fi'
import { AiOutlineGift, AiOutlineTwitter } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import ColorLogo from '../../Assets/Images/logo-color_el4zmy.svg'
import { IoLogoPinterest } from 'react-icons/io'
import { BiLogoLinkedin, BiLogoWhatsapp } from 'react-icons/bi'
import { TiSocialFacebook } from 'react-icons/ti'
import paypal from '../../Assets/Images/png-transparent-paypal-business-logo-computer-icons-paypal-blue-text-trademark-thumbnail-removebg-preview.png'
import visa from '../../Assets/Images/Visa_Inc.-Logo.wine.png'
import mastercard from '../../Assets/Images/MasterCard_early_1990s_logo.png'
import maestro from '../../Assets/Images/maestro-2-logo.png'
import american from '../../Assets/Images/American_Express_logo_(2018).svg.png'

const Footer = () => {
    return (
        <>
            <div className="Footer">
                <div className="store-apps flex items-center min-h-[70vh] bg-[#eef2ff] grid grid-cols-3">
                    <div className='flex justify-center'>
                        <img src={Uiimg1} alt="" />
                    </div>
                    <div className='store-app-sub1 text-center'>
                        <h1 className='text-3xl font-bold mb-4'>Get Your Daily Needs From Our KachaBazar Store</h1>
                        <p className='text-lg text-neutral-700'>There are many products you will find in our shop, Choose your daily necessary product from our KachaBazar shop and get some special offers.</p>
                        <div className="buttons flex gap-5 justify-center mt-8">
                            <button className='bg-[#000000] text-white p-2 w-[195px] rounded-md'><a href="#" className='flex gap-4'>
                                <FaApple className='text-[43px]' />
                                <div className='text-start'>
                                    <p className='text-[10px]'>Available on the</p>
                                    <h1 className='font-medium text-xl'>App Store</h1>
                                </div>
                            </a></button>
                            <button className='bg-[#000000] text-white p-2 w-[195px] rounded-md'><a href="#" className='flex gap-4'>
                                <img src={Playstore} alt="" />
                                <div className='text-start'>
                                    <p className='text-[10px]'>Available on the</p>
                                    <h1 className='font-medium text-xl'>Google Play</h1>
                                </div>
                            </a></button>
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <img src={Uiimg2} alt="" />
                    </div>
                </div>
                <div className="Footer-sub2 flex justify-between p-11 py-6 border-b-[1.5px] mb-10">
                    <p className='w-72 text-sm flex justify-center items-center text-slate-950 font-medium border-r border-inherit'><MdOutlineLocalShipping className='text-xl me-3 text-[#059669]' />Free Shipping From €500.00</p>
                    <p className='w-72 text-sm flex justify-center items-center text-slate-950 font-medium border-r border-inherit'><FiPhoneCall className='text-lg me-3 text-[#059669]' />Support 24/7 At Anytime</p>
                    <p className='w-72 text-sm flex justify-center items-center text-slate-950 font-medium border-r border-inherit'><FiCreditCard className='text-lg me-3 text-[#059669]' />Secure Payment Totally Safe</p>
                    <p className='w-72 text-sm flex justify-center items-center text-slate-950 font-medium border-r border-inherit'><AiOutlineGift className='text-xl me-3 text-[#059669]' />Latest Offer Upto 20% Off</p>
                </div>
                <div className="Main-Footer grid grid-cols-4 gap-20 p-12 py-5">
                    <div className=''>
                        <h1 className='text-xl mb-6'>Company</h1>
                        <ul className='leading-8 text-neutral-500'>
                            <li><Link to='/about'>About Us</Link></li>
                            <li><Link to='/contact'>Contact Us</Link></li>
                            <li><Link to=''>Careers</Link></li>
                            <li><Link to=''>Latest News</Link></li>
                        </ul>
                    </div>
                    <div className=''>
                        <h1 className='text-xl mb-6'>Latest News</h1>
                        <ul className='leading-8 text-neutral-500'>
                            <li><Link to=''>Fish & Meat</Link></li>
                            <li><Link to=''>Soft Drink</Link></li>
                            <li><Link to=''>Milk & Dairy</Link></li>
                            <li><Link to=''>Beauty & Health</Link></li>
                        </ul>
                    </div>
                    <div className=''>
                        <h1 className='text-xl mb-6'>My Account</h1>
                        <ul className='leading-8 text-neutral-500'>
                            <li><Link to=''>Dashboard</Link></li>
                            <li><Link to=''>My Orders</Link></li>
                            <li><Link to=''>Recent Orders</Link></li>
                            <li><Link to=''>Update Profile</Link></li>
                        </ul>
                    </div>
                    <div className='text-[15px] text-neutral-500'>
                        <img src={ColorLogo} alt="Logo" className='mb-6 h-10' />
                        <p className='leading-8'>987 Andre Plain Suite High Street 838, Lake Hestertown, USA</p>
                        <p className='leading-8'>Tel : 02.356.1666</p>
                        <p className='leading-8'>Email : ccruidk@test.com</p>
                    </div>
                </div>
                <div className="border Social-border m-14 mb-0"></div>
                <div className="Social-Follow mx-11 me-12 me-5 rounded-xl min-h-48 bg-[#f9fafb] grid grid-cols-3 gap-16 ">
                    <div className='mb-3 flex justify-center ms-8 flex-col'>
                        <p className='text-xl font-normal mb-4'>Follow Us</p>
                        <div className='flex items-center gap-4'>
                            <Link to=''><TiSocialFacebook className='text-white h-8 w-8 p-[4px] bg-[#3b5998] rounded-3xl' /></Link>
                            <Link to=''><AiOutlineTwitter className='text-white h-8 w-8 p-[5px] rounded-3xl bg-[#00aced]' /></Link>
                            <Link to=''><IoLogoPinterest className='text-white h-8 w-8 p-[5px] rounded-3xl bg-[#cb2128]' /></Link>
                            <Link to=''><BiLogoLinkedin className='text-white h-8 w-8 p-[5px] rounded-3xl bg-[#007fb1]' /></Link>
                            <Link to=''><BiLogoWhatsapp className='text-white h-8 w-8 p-[2px] rounded-3xl bg-[#25d366]' /></Link>
                        </div>
                    </div>
                    <div className='text-center flex flex-col justify-center'>
                        <h1 className='text-lg'>Call Us Today!</h1>
                        <p className='text-2xl font-bold text-[#10b981]'>+6599887766</p>
                    </div>
                    <div className='flex items-center justify-center'>
                        <form>
                            <fieldset className="border-2 rounded-lg w-auto">
                                <legend>
                                    <img src={paypal} alt="" className='h-10' />
                                </legend>
                                <div className='flex items-center gap-2 w-full'>
                                    <img src={visa} alt="" className='h-12 w-auto' />
                                    <img src={mastercard} alt="" className='h-6 w-auto' />
                                    <img src={maestro} alt="" className='h-10 w-auto' />
                                    <img src={american} alt="" className='h-8 w-auto me-3' />
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
                <p className='flex items-center justify-center my-4'>Copyright 2024 @&nbsp;<span className='flex items-center text-green-600 font-medium'>CodingHeart&nbsp;<FaHeart className='text-red-500 mt-1'/></span>, All rights reserved.</p>
            </div>
        </>
    )
}

export default Footer