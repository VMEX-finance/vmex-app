import React from 'react';
import {  BsCheck } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";

interface IActiveStatus {
  active: boolean;
  size?: "sm" | "md" | "lg"
}

const ActiveStatus = ({ active, size }: IActiveStatus) => {
  const determineSize = () => {
    switch(size) {
      case 'lg': return '36px';
      case 'sm': return '24px';
      default: return '30px'
    }
  }

  const determineColor = () => {
    if(active) return 'text-emerald-600';
    return 'text-red-600'
  }

  return (
    <div className={`${determineColor()} flex items-center`}>
      <div>
          {active ? 
            <BsCheck size={determineSize()} /> : 
            <IoIosClose size={determineSize()} /> }
      </div>
      <span>{active ? "Enabled" : "Disabled"}</span>
    </div>
  )
}

export default ActiveStatus;