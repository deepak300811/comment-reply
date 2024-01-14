import { useEffect, useRef, useState } from "react";
import "./App.css";
import CommentInputForm from "./components/CommentInputForm";
import MessageBox from "./components/MessageBox";

function App() {
  const [allComments, setAllComments] = useState([]);
  const [commentToEdit, setCommentToEdit] = useState({});
  const [commentToReply, setCommentToReply] = useState({});
  const   inputFormRef = useRef(null);
  const   messageCardRef = useRef(null);
  const [latestFirstMode,setLatestFirstMode] =  useState(false);

  useEffect(()=>{
      const getStoredComments = async ()=>{
        let localStorageComments = await JSON.parse(window.localStorage.getItem("allStoredComments"));
        let localStorageSortMode = await JSON.parse(window.localStorage.getItem("latestFirstMode"));
        setAllComments(localStorageComments || [])
        setLatestFirstMode(localStorageSortMode)
      }
      getStoredComments()
  },[])

  const clearLocalStorage= ()=>{
    window.localStorage.removeItem("allStoredComments")
    window.localStorage.removeItem("latestFirstMode")
  }

  useEffect(()=>{
    if(allComments.length>0){
      let toStoreComments=JSON.stringify(allComments);
      window.localStorage.setItem("allStoredComments",toStoreComments)
      window.localStorage.setItem("latestFirstMode",latestFirstMode ? 'true' : 'false' )
    }
  },[allComments,latestFirstMode])

    // Function to scroll to the element
    const scrollToElement = () => {
      if (inputFormRef.current) {
        inputFormRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };


    const scrollToEdittedCard = () => {
      if (messageCardRef.current) {
        messageCardRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

  const addComment = (inputComment) => {
    if(!commentToReply?.name){
      if(!latestFirstMode){
        setAllComments([...allComments, inputComment]);
      }
      else{
        setAllComments([inputComment,...allComments ]);
      }
    }
    else{
      setAllComments(
        allComments.map((item) => {
          if (item.id === inputComment.parentId) {
            if(!latestFirstMode){

              item.childComments = [...item.childComments, inputComment]
            }
            else{
              item.childComments = [inputComment,...item.childComments ]
            }
            return item;
          }
          return item;
        })
      );

      setCommentToReply({});
      setCommentToEdit({});
    }
  };

  const editComment = (newChangedComment) => {
    let temp=[]
    if(newChangedComment?.parentId){
      allComments[newChangedComment.parentPosition].childComments[newChangedComment.position].comment= newChangedComment.comment
      temp=allComments
  
    }
    else{
      allComments[newChangedComment.position].comment=newChangedComment.comment
      temp=allComments
    }
    setAllComments(
      [...temp]
    );
    scrollToEdittedCard();
    setCommentToEdit({});
  };

  const compareFun =(a,b)=>{
    const aObj =new Date(a.date);
    const bObj= new Date(b.date);
    if(aObj<bObj){
      return latestFirstMode ? 1 : -1
    }
    else{
      return latestFirstMode ? -1 : 1
    }
  }

  useEffect(()=>{
      let tempArr=allComments.sort(compareFun);
      let tempArr2=tempArr.map(item=>{
        if(item?.childComments?.length){
        return  {...item,childComments:item?.childComments?.sort(compareFun)}
        }
        else{
          return item
        }
      })
      setAllComments([...tempArr2])
  },[latestFirstMode])


  const deleteComment= (commentToDelete)=>{
    if(!commentToDelete?.parentId){
      allComments.splice(commentToDelete.position, 1)

        setAllComments([...allComments]);
        if(allComments.length===0){
          clearLocalStorage()
        }
    }
    else{
      allComments[commentToDelete.parentPosition].childComments.splice(commentToDelete.position,1)
      setAllComments([...allComments]);
    }
  }
  return (
    <div className="p-4">
  
      <div ref={inputFormRef}>
      <CommentInputForm addComment={addComment} commentToEdit={commentToEdit} editComment={editComment} />
      </div>
      <div className="flex justify-between my-4 items-center">

      <button className=" text-sm p-2 bg-gray-300  rounded" onClick={()=>setLatestFirstMode(!latestFirstMode)}>Click To Change Order </button>
      <p className="text-sm"> { latestFirstMode? 'Sorted by Latest to Oldest':'Sorted by Oldest to Latest'}</p>
      </div>

      <>
        {allComments.map((item, outerIndex) => {
          return (
            <div key={outerIndex}>
            <div  ref={item?.id===commentToEdit?.id ? messageCardRef: null}  >
              <MessageBox
                commentData={item}
               
                onClickEdit={() =>{
                  scrollToElement()
                  setCommentToReply({})
                  setCommentToEdit({
                    ...item,
                    position:outerIndex
                  })
                }}
                setCommentToReply={() =>{ setCommentToEdit({}); setCommentToReply(item)}}
                onClickDelete={deleteComment}
                position={outerIndex}

              />
              </div>
              {
                commentToReply?.id===item.id &&
              <div className="mt-4 ml-10" key={outerIndex} >
                <CommentInputForm addComment={addComment} commentToEdit={commentToEdit} editComment={editComment} commentToReply={commentToReply} />
              </div>
              }
              {
                item?.childComments?.map((item,index)=>{
                  return   <div className="ml-10" ref={item?.id===commentToEdit?.id ? messageCardRef: null}        key={index}> <MessageBox
                  commentData={item}
           
                  onClickEdit={() =>
                    {
                      scrollToElement()
                      setCommentToReply({})
                      setCommentToEdit({
                      ...item,
                      parentPosition:outerIndex,
                      position:index
                    })}
                  }
                  parentPosition={outerIndex}
                  position={index}
                  onClickDelete={deleteComment}
                />
                </div>
                })
              }
            </div>
          );
        })}
      </>
    </div>
  );
}

export default App;
