import React, { useEffect, useState } from 'react'
import uniqid from 'uniqid';

const CommentInputForm = ({addComment,commentToEdit,editComment, commentToReply}) => {
const [name,setName] = useState("");
const [comment,setComment] = useState("");
const [errorObj,setErrorObj] = useState({
  nameError:"",
  commentError:""
})

useEffect(()=>{
    if(commentToEdit?.name){
      setErrorObj({
        nameError:"",
        commentError:""
      })
    }
},[commentToEdit])
const sendComment =()=>{
  if(!name.trim() || !comment.trim()){
   const tempObj={};
   if(!name.trim()){
     tempObj.nameError="Name field cannot be empty."
   }
   if(!comment.trim()){
    tempObj.commentError="Comment field cannot be empty."
   }
   setErrorObj(tempObj)
  }
  else{
    commentToEdit?.name && editComment({
      comment:comment,
      id:commentToEdit.id,
      parentId:commentToEdit?.parentId,
      position: commentToEdit?.position,
      parentPosition: commentToEdit?.parentPosition
    }) 
    !commentToEdit?.name && !commentToReply?.name &&  addComment({
              name:name,
              comment:comment,
              date:new Date(),
              id: uniqid(),
              childComments:[]
      })
      commentToReply?.name && addComment({
        name:name,
        comment:comment,
        date:new Date(),
        id: uniqid(),
        parentId: commentToReply?.id
      })
      setName("")
      setComment("")
  }
}
useEffect(()=>{
  if(commentToEdit?.name){
    setName(commentToEdit?.name)
    setComment(commentToEdit?.comment)
  }
},[commentToEdit])

useEffect(()=>{
  if(name){
    setErrorObj({...errorObj,nameError:""})
  }
  if(comment){
    setErrorObj({...errorObj,commentError:""})
  }
},[name,comment])
  return (
    <div className="p-4 bg-gray-200">
    <p className="mb-2">Comment</p>
    <div className="flex flex-col ">
      <div className='mb-4'>

      <input type="text" placeholder="Name" className="border border-gray-300 mb-2 p-4 !pt-2 no-outline w-full" value={ !commentToEdit?.name ? name : commentToEdit?.name} onChange={(e)=>setName(e.target.value)}/>
     {errorObj?.nameError && <p className='text-red-600 text-sm'>{errorObj?.nameError}</p>}
      </div>
      <div className='mb-4'>
      <textarea cols={3} className="border border-gray-300 mb-2  p-4 !pt-2 no-outline w-full" placeholder="Comment" value={comment} onChange={(e)=>setComment(e.target.value)}/>
      {errorObj?.commentError && <p className='text-red-600 text-sm'>{errorObj?.commentError}</p>}
      </div>
    <button className="self-end py-1 px-5 bg-blue-500 text-white rounded-md" onClick={sendComment}>Post</button>
    </div>
  </div>
  )
}

export default CommentInputForm
