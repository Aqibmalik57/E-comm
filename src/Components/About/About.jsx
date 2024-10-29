import React, { useEffect, useRef } from 'react';
import Navbar from '../Navbar/Navbar';
import './about.css';
import Veg1 from '../../Assets/Images/vecteezy_a-vibrant-assortment-of-fresh-fruits-and-vegetables-isolated_46822441.png';
import Veg2 from '../../Assets/Images/vecteezy_vegetable-png-transparent_22984730.png';
import Veg3 from '../../Assets/Images/pexels-photo-27175861.webp';
import Veg4 from '../../Assets/Images/free-photo-of-woman-doing-grocery-shopping.jpeg';
import Veg5 from '../../Assets/Images/free-photo-of-vegetables-in-grocery-store.jpeg';
import Veg6 from '../../Assets/Images/sl8vzvzm54jgzq6sphn2.webp';
import Pers1 from '../../Assets/Images/team-1_acjmv7.webp';
import Pers2 from '../../Assets/Images/team-2_dw7zs1.webp';
import Pers3 from '../../Assets/Images/team-3_ld3323.webp';
import Pers4 from '../../Assets/Images/team-4_i7jvx7.webp';
import Pers5 from '../../Assets/Images/team-5_ylyklw.webp';
import Pers6 from '../../Assets/Images/team-6_gmlts4.webp';
import Footer from '../Footer/Footer';

const About = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  return (
    <>
      <div ref={ref} className='About'>
        <Navbar />
        <div className='About-us flex justify-between items-center h-44'>
          <img src={Veg1} alt='' />
          <h1 className='text-5xl font-medium'>About Us</h1>
          <img src={Veg2} alt='' />
        </div>
        <div className='shop-detail grid grid-cols-2 min-h-[130vh]'>
          <div className='h-full flex flex-col justify-center p-11 pb-4'>
            <h1 className='mb-5 text-3xl font-medium'>
              Welcome to our KachaBazar shop
            </h1>
            <p className='text-lg text-neutral-700 font-normal para-font'>
              Holisticly seize parallel metrics and functional ROI.Seamlessly
              revolutionize error-free internal or organic sources before
              effective scenarios. Progressively incentivize state of the art
              applications for efficient intellectual capital. Credibly leverage
              existing distinctive mindshare through cutting-edge schemas.
              Proactively procrastinate team building paradigms coordinate
              client-centric total transparent internal. Dynamically embrace
              diverse customer service and installed base paradigms. Credibly
              seize enterprise-wide experiences for end-to-end data.
              Professionally brand flexible alignments and cost effective
              architectures. Enthusiastically incentivize seamless communities
              with seamlessly facilitate revolutionary metrics with strategic
              theme areas.
            </p>
            <div className='grid gap-7 grid-cols-2 mt-7'>
              <div className='bg-[#eef2ff] p-6 rounded-xl'>
                <h1 className='text-3xl font-extrabold leading-relaxed'>8K</h1>
                <h4 className='text-xl font-[550] leading-relaxed'>
                  Lovely Customer
                </h4>
                <p className='para-font font-normal'>
                  Competently productize virtual models without performance.
                </p>
              </div>
              <div className='bg-[#eef2ff] p-6 rounded-xl'>
                <h1 className='text-3xl font-extrabold leading-relaxed'>10K</h1>
                <h4 className='text-xl font-[550] leading-relaxed'>
                  Listed Products
                </h4>
                <p className='para-font font-normal'>
                  Dynamically morph team driven partnerships after vertical
                </p>
              </div>
            </div>
          </div>
          <div className='h-full pe-11 shop-detail-sub2 grid grid-cols-2 gap-4 flex items-center'>
            <div className='grid grid-rows-2 gap-4'>
              <img src={Veg3} alt='' className='rounded-2xl' />
              <img src={Veg4} alt='' className='rounded-2xl' />
            </div>
            <div>
              <img src={Veg5} alt='' className='rounded-2xl' />
            </div>
          </div>
        </div>
        <div className='more-detail p-11 pt-0'>
          <p className='text-lg text-neutral-700 font-normal para-font mb-5'>
            Holisticly seize parallel metrics and functional ROI. Seamlessly
            revolutionize error-free internal or organic sources before
            effective scenarios. Progressively incentivize state of the art
            applications for efficient intellectual capital. Credibly leverage
            existing distinctive mindshare through cutting-edge schemas.
            Proactively procrastinate team building paradigms coordinate
            client-centric total transparent internal. Energistically
            reconceptualize global leadership for high-quality networks.
            Credibly restore an expanded array of systems rather than accurate
            results. Collaboratively synergize backend bandwidth without 24/7
            functionalities. Credibly utilize proactive ideas whereas
            cross-media core competencies. Uniquely maximize professional best
            practices through resource maximizing services. Conveniently
            architect cross-unit web services for e-business imperatives.
          </p>
          <p className='text-lg text-neutral-700 font-normal para-font mb-14'>
            Appropriately visualize market-driven data before one-to-one
            scenarios. Collaboratively productize multifunctional ROI through
            intuitive supply chains. Enthusiastically seize revolutionary value
            and process-centric services. Competently harness intuitive
            information after interoperable markets. Interactively revolutionize
            future-proof value before granular sources. Dynamically embrace
            diverse customer service and installed base paradigms. Credibly
            seize enterprise-wide experiences for end-to-end data.
            Professionally brand flexible alignments and cost effective
            architectures. Enthusiastically incentivize seamless communities
            with seamlessly facilitate revolutionary metrics with strategic
            theme areas.
          </p>
          <img src={Veg6} alt='' className='rounded-2xl' />
        </div>
        <div className='Our-team min-h-[90vh] bg-[#f9fafb] mt-7 flex flex-col justify-center p-11'>
          <h1 className='text-5xl font-bold mb-5'>Our Team</h1>
          <p className='w-3/5 para-font text-lg font-normal'>
            We’re impartial and independent, and every day we create
            distinctive, world-class reintermediate backend supply programmes.
          </p>
          <div className='grid grid-cols-6 gap-8 mt-8'>
            <div className='leading-7'>
              <img src={Pers1} alt='' className='rounded-lg' />
              <h1 className='font-bold text-xl mt-4'>Niamh Shea</h1>
              <p className='text-neutral-500'>Co-founder & Executive</p>
            </div>
            <div className='leading-7'>
              <img src={Pers2} alt='' className='rounded-lg' />
              <h1 className='font-bold text-xl mt-4'>Orla Dwyer</h1>
              <p className='text-neutral-500'>Orla Dwyer</p>
            </div>
            <div className='leading-7'>
              <img src={Pers3} alt='' className='rounded-lg' />
              <h1 className='font-bold text-xl mt-4'>Danien James</h1>
              <p className='text-neutral-500'>Co-founder, Chairman</p>
            </div>
            <div className='leading-7'>
              <img src={Pers4} alt='' className='rounded-lg' />
              <h1 className='font-bold text-xl mt-4'>Dara Frazier</h1>
              <p className='text-neutral-500'>Chief Strategy Officer</p>
            </div>
            <div className='leading-7'>
              <img src={Pers5} alt='' className='rounded-lg' />
              <h1 className='font-bold text-xl mt-4'>Glenda Arvidson</h1>
              <p className='text-neutral-500'>HR Officer</p>
            </div>
            <div className='leading-7'>
              <img src={Pers6} alt='' className='rounded-lg' />
              <h1 className='font-bold text-xl mt-4'>Melvin Davis</h1>
              <p className='text-neutral-500'>Lead Developer</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default About;
