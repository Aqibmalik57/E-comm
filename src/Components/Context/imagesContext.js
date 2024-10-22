import Context from '../Context/ProductContext'
import pers from "../../Assets/Images/man-icon-flat-design-line-type-icon-illustration-vector-ux_661325_wh860-removebg-preview.png";
import fish from "../../Assets/Images/carp-fish_paxzrt.webp";
import cabbage from "../../Assets/Images/cabbage_n59uv3.webp";
import pan from "../../Assets/Images/frying-pan_vglm5c.webp";
import biscuit from "../../Assets/Images/cookie_1_ugipqa.webp";
import spray from "../../Assets/Images/spray_pebsjt.webp";
import cat from "../../Assets/Images/cat_tznwmq.webp";
import women from "../../Assets/Images/beauty_vfbmzc.webp";
import jam from "../../Assets/Images/strawberry-jam-1.webp";
import milk from "../../Assets/Images/milk_dcl0dr.webp";
import juice from "../../Assets/Images/juice_p5gv5k.webp";
import breakfast from "../../Assets/Images/bagel_mt3fod.webp";
import { useState } from 'react';

const Imageprovider  = ({children}) =>{
    const CarousalImages = [
        pers,
        fish,
        cabbage,
        pan,
        biscuit,
        spray,
        cat,
        women,
        jam,
        milk,
        juice,
        breakfast
    ]
    const [images, setImages] = useState(CarousalImages)
    return(
        <Context.Provider value={{images}}>
            {children}
        </Context.Provider>
    )
}

export default Imageprovider