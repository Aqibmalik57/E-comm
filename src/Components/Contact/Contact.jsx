import React, { useEffect, useRef } from 'react';
import './contact.css';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';
import Veg1 from '../../Assets/Images/vecteezy_a-vibrant-assortment-of-fresh-fruits-and-vegetables-isolated_46822441.png';
import Veg2 from '../../Assets/Images/vecteezy_vegetable-png-transparent_22984730.png';
import { MdOutlineMailOutline } from 'react-icons/md';
import { FiBell } from 'react-icons/fi';
import { GrLocation } from 'react-icons/gr';
import contact from '../../Assets/Images/contact-us.webp';
import Footer from '../Footer/Footer';

const Contact = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  return (
    <>
      <div ref={ref} className='contact'>
        <Navbar />
        <div className='About-us flex justify-between items-center h-44'>
          <img src={Veg1} alt='' />
          <h1 className='text-5xl font-medium'>Contact Us</h1>
          <img src={Veg2} alt='' />
        </div>
        <div className='contact-cards flex justify-evenly p-10 mt-10'>
          <div className='flex flex-col items-center justify-center pb-10 px-8 border-gray-300 rounded-md border'>
            <MdOutlineMailOutline className='text-4xl mb-4 text-[#3cc598]' />
            <h1 className='text-2xl font-bold mb-3'>Email Us</h1>
            <p className='text-center text-md w-72 leading-7 font-[450]'>
              <Link to='' className='text-[#47c99e] font-medium'>
                info@kachabazar.com
              </Link>{' '}
              Interactively grow empowered for process-centric total linkage.
            </p>
          </div>
          <div className='flex flex-col items-center justify-center pb-8 px-8 border-gray-300 rounded-md border'>
            <FiBell className='text-4xl mb-4 text-[#3cc598]' />
            <h1 className='text-2xl font-bold mb-3'>Call Us</h1>
            <p className='text-center text-md w-72 leading-7 font-[450]'>
              <Link to='' className='text-[#47c99e] font-medium'>
                029-00124667
              </Link>{' '}
              Distinctively disseminate focused solutions clicks-and-mortar
              ministate.
            </p>
          </div>
          <div className='flex flex-col items-center justify-center pb-8 px-8 border-gray-300 rounded-md border'>
            <GrLocation className='text-4xl mb-4 text-[#3cc598] mt-12' />
            <h1 className='text-2xl font-bold mb-3'>Location</h1>
            <p className='text-center text-md w-72 leading-7 font-[450]'>
              Boho One, Bridge Street West, Middlesbrough, North Yorkshire, TS2
              1AE.
            </p>
            <p>561-4535 Nulla LA</p>
            <p>United States 96522.</p>
          </div>
        </div>
        <div className='contact-form grid grid-cols-2 p-10 pt-11 mb-12'>
          <div>
            <img src={contact} alt='' className='w-[550px]' />
          </div>
          <div className='ps-6'>
            <h1 className='font-bold text-4xl'>
              For any suppoort just send your query
            </h1>
            <p className='text-lg mt-5'>
              Collaboratively promote client-focused convergence vis-a-vis
              customer-directed alignments via plagiarized strategic users and
              standardized infrastructures.
            </p>

            <form action='' className='mt-10'>
              <div className='grid grid-cols-2 gap-5'>
                <div>
                  <label className='text-[#7c82a4]'>Your Name</label>
                  <input
                    type='text'
                    name='name'
                    className='p-3 mt-2 border w-full border-gray-[#a2aabd] rounded-md outline-[0.1px] outline-[#47c99e]'
                    placeholder='Enter Your Name'
                    required
                  />
                </div>
                <div>
                  <label className='text-[#7c82a4]'>Your Email</label>
                  <input
                    type='email'
                    name='email'
                    className='p-3 mt-2 border w-full border-gray-[#a2aabd] rounded-md outline-[0.1px] outline-[#47c99e]'
                    placeholder='Enter Your Email'
                    required
                  />
                </div>
              </div>
              <div className='mt-4 mb-4'>
                <label className='text-[#7c82a4]'>Subject</label>
                <input
                  type='text'
                  name='subject'
                  className='p-3 mt-2 border w-full border-gray-[#a2aabd] rounded-md outline-[0.1px] outline-[#47c99e]'
                  placeholder='Enter your subject'
                />
              </div>
              <label className='text-[#7c82a4]'>Message</label>
              <textarea
                name='message'
                id=''
                cols='30'
                rows='3'
                className='p-3 mt-2 border w-full border-gray-[#a2aabd] rounded-md outline-[0.1px] outline-[#47c99e]'
                placeholder='Write your message here....'
              ></textarea>

              <button className='bg-[#10b981] font-medium text-white mt-6 px-7 py-3 rounded-md'>
                Send Message
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
