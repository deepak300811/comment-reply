import React from "react";
import BinComponent from "./BinComponent";

const MessageBox = ({ commentData, onClickEdit, setCommentToReply,onClickDelete, position, parentPosition }) => {
  const internalDate=new Date(commentData?.date)
  return (
    <div className="mt-4">
      <div className="bg-gray-200 p-2 relative">
        <p className="absolute top-1 right-2 text-sm">
          {internalDate?.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
        <p className="justify-between mb-2  font-medium">{commentData?.name}</p>
        <p className="text-sm">{commentData?.comment}</p>
        <div className=" text-blue-700 font-medium text-xs mt-4">
        {setCommentToReply &&  <button className="mr-4" onClick={setCommentToReply}>
            Reply
          </button>}
          <button onClick={onClickEdit}>Edit</button>
        </div>
        <button className="absolute left-[97%] top-[calc(50%_-_8px)] rounded-full bg-gray-600 p-1 cursor-pointer" onClick={()=>onClickDelete({...commentData,position:position, parentPosition:parentPosition})}><BinComponent/></button>
      </div>
    </div>
  );
};

export default MessageBox;
