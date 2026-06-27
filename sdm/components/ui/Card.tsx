import { ReactNode } from 'react';

interface Props{
    children:ReactNode;
}

export default function Card({children}:Props){

    return(

<div
className="rounded-[28px] bg-white border border-gray-100 p-6 shadow-sm transition-all hover:shadow-md"
>

{children}

</div>

    )

}