// import React from 'react'
// import { formatterUtility } from '../utilities/formatterutility'

// interface SelectedProductRowProps {
//   id: string;
//   item: string;
//   price: number;
//   quantity: number;
//   isPrinting: boolean;
// }

// const SelectedProductRow = ({ item, quantity, price, isPrinting }: SelectedProductRowProps) => {
//   return (
//     <div className={`flex items-center justify-between py-2 border-b border-b-black ${isPrinting ? "text-[10px]" : "text-xs"} last:border-b-0 last:pb-0 group hover:cursor-pointer transition-all duration-300`}>
//         <div className="flex flex-col items-start justify-between w-2/3">
//             <p className='line-clamp-1'>{item}</p>
//             <h4 className='w-1/3 text-start'>{formatterUtility(Number(price)*Number(quantity))}</h4>
//         </div>
//         <small>X{quantity}</small>
//     </div>
//   )
// }

// export default SelectedProductRow


import { formatterUtility } from '../utilities/formatterutility';

interface SelectedProductRowProps {
  id: number;
  item: string;
  price: number;
  quantity: number;
  isPrinting: boolean;
  rowClassName?: string;
  descClassName?: string;
  qtyClassName?: string;
  priceClassName?: string;
}

const SelectedProductRow = ({
  item,
  quantity,
  price,
  isPrinting,
  rowClassName = '',
  descClassName = '',
  qtyClassName = '',
}: SelectedProductRowProps) => {
  const totalPrice = formatterUtility(Number(price) * Number(quantity));

  if (isPrinting) {
    return (
      <tr className={`border-b flex items-center justify-between border-dashed print:border-black/50 ${rowClassName}`}>
        <td className={`py-1 print:pr-1 ${descClassName}`}>
          <div className="text-[10px]">
            <span className="print:line-clamp-none print:break-all print:overflow-hidden print:whitespace-normal print:text-left">{item}</span>
            <h4 className="print:font-bold">{totalPrice}</h4>
          </div>
        </td>
        <td className={`print:text-right print:px-0.5 ${qtyClassName}`}>
          <small className="print:text-[10px] inline-block w-full text-right">
            x{quantity}
          </small>
        </td>
      </tr>
    );
  }

  // Screen: Original flex layout
  return (
    <div className="flex items-center justify-between py-2 border-b border-b-black text-xs group hover:cursor-pointer transition-all duration-300 last:border-b-0 last:pb-0">
      <div className="flex flex-col items-start justify-between w-2/3">
        <p className="line-clamp-1">{item}</p>
        <h4 className="w-1/3 text-start">{totalPrice}</h4>
      </div>
      <small>X{quantity}</small>
    </div>
  );
};

export default SelectedProductRow;