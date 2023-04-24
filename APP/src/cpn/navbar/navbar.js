import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default (props) => {
  const { highlight, navState, proxy, unique_string, version } = useSelector(
    (state) => state
  );
  const { dateGenerator, autoLabel, openTab } = useSelector(
    (state) => state.functions
  );
  const [collections, setCollections] = useState([]);
  const [collection, setCollection] = useState([]);
  const { page_param } = useParams();

  const [pages, setPages] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/ui.json');
        setPages(response.data.pages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const criterias = [
    { id: 0, label: 'ALL', value: null },
    { id: 1, label: 'GET', value: 'get' },
    { id: 2, label: 'POST', value: 'post' },
    { id: 3, label: 'PUT', value: 'put' },
    { id: 4, label: 'DELETE', value: 'delete' },
  ];
  const [filter, setFilter] = useState(criterias[0]);

  const dispatch = useDispatch();

  const { urls, bottomUrls } = props;

  const navTrigger = () => {
    dispatch({
      type: 'setNavState',
      payload: {
        navState: !navState,
      },
    });
  };

  const filtingApi = () => {
    let result = [];
    if (filter.value != null) {
      result = collection[filter.value];
    } else {
      const rooms = ['get'];
      rooms.map((room) => {
        if (collection[room]) result = [...result, ...collection[room]];
      });
    }

    return result;
  };

    return (

                <div className={`rel navbar z-index-10 ${navState ? "nav-show" : "nav-hide"}`}>
                    <div className="flex flex-no-wrap m-t-0-5">
                        <div className="w-72-px pointer order-0">
                            <div className="block p-1" onClick={() => { navTrigger() }}>
                                <span className="block w-24-px border-3-top" style={{ marginTop: "4px" }} />
                                <span className="block w-24-px border-3-top" style={{ marginTop: "4px" }} />
                                <span className="block w-24-px border-3-top" style={{ marginTop: "4px" }} />
                            </div>
                        </div>
                        <div className="w-100-pct order-1">
                            {/* <img className="w-84-px block ml-auto m-r-1" src="/assets/image/mylan.png"/> */}
                        </div>
                    </div>
                    <div className="m-t-2">
                        {urls.map(url =>
                            <div onClick={() => { window.location = url.url }} className={`flex flex-no-wrap m-t-0-5 pointer hover ${url.id === highlight ? "highlight" : ""}`} key={url.id}>
        
                                <div className="w-72-px pointer order-0">
                                    <div className="block p-0-5">
                                        <img className="w-24-px block mg-auto m-l-0-5" src={`/assets/icon/navbar/${url.icon}`} />
        
                                    </div>
                                </div>
                                <div className="w-100-pct p-0-5 order-1">
                                    <span className="text-16-px block p-l-0-5">{url.label}</span>
                                </div>
                            </div>
                        )}
        
                        {pages.map(page =>
        
                            <div onClick={() => { openTab(`/fetch/${page.param}`) }} className={`flex flex-no-wrap m-t-0-5 pointer hover ${page_param === page.param ? "highlight" : ""}`} key={page.id}>
        
                                <div className="w-72-px pointer order-0">
                                    <div className="block p-0-5">
                                        <img className="w-24-px block mg-auto m-l-0-5" src="/assets/icon/navbar/ui.png" />
                                    </div>
                                </div>
                                <div className="w-100-pct p-0-5 order-1">
                                    <span className="text-16-px block p-l-0-5">{page.title} </span>
                                </div>
                            </div>
        
                        )}
        
                    </div>
        
                    <div className="abs b-0 l-0 w-100-pct">
                        {/* { bottomUrls.map( url =>
                        <div onClick={ () => { window.location = url.url } } className={`flex flex-no-wrap m-t-0-5 pointer hover ${ url.id === highlight ? "login-bg": "" }`} key ={ url.id }>
                            <div className="w-72-px pointer order-0">
                                <div className="block p-0-5">
                                    <img className="w-24-px block mg-auto m-l-0-5" src={`/assets/icon/navbar/${url.icon}`}/>
                                </div>
                            </div>
                            <div className="w-100-pct p-0-5 order-1">
                                <span className="text-16-px block p-l-0-5">{url.label}</span>
                            </div>
                        </div>
                    )} */}
                    </div>
        
                </div>
            )
        }






















// import { useSelector, useDispatch } from 'react-redux';
// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';


// export default (props) => {
//     const { highlight, navState, proxy, unique_string, version, pages } = useSelector(state => state);
//     const { dateGenerator, autoLabel, openTab } = useSelector(state => state.functions)
//     const [collections, setCollections] = useState([]);
//     const [collection, setCollection] = useState([]);
//     const { page_param } = useParams()

//     const criterias = [
//         { id: 0, label: "ALL", value: null },
//         { id: 1, label: "GET", value: "get" },
//         { id: 2, label: "POST", value: "post" },
//         { id: 3, label: "PUT", value: "put" },
//         { id: 4, label: "DELETE", value: "delete" },
//     ]
//     const [filter, setFilter] = useState(criterias[0])

//     // useEffect(() => {
//     //     const id_str = page.apis.get.split('/')[6];
//     //     fetch(`${proxy}/api/${unique_string}/apis/version/${version ? version.version_id : 1}`).then(res => res.json())
//     //         .then(res => {
//     //             const { collections } = res;

//     //             if (collections.length > 0) {
//     //                 setCollection(collections[0])
//     //             }
//     //             setCollections(collections);
//     //         })
//     // }, [])

//     const dispatch = useDispatch();

//     const { urls, bottomUrls } = props;

//     const navTrigger = () => {
//         dispatch({
//             type: "setNavState",
//             payload: {
//                 navState: !navState
//             }
//         })
//     }

//     const filtingApi = () => {
//         let result = []
//         if (filter.value != null) {
//             result = collection[filter.value];
//         } else {

//             {/* const rooms = [ "get", "post", "put", "delete" ] */ }
//             const rooms = ["get"]
//             rooms.map(room => {
//                 if (collection[room])
//                     result = [...result, ...collection[room]]
//             })
//         }

//         return result
//     }

//     return (

//         <div className={`rel navbar z-index-10 ${navState ? "nav-show" : "nav-hide"}`}>
//             <div className="flex flex-no-wrap m-t-0-5">
//                 <div className="w-72-px pointer order-0">
//                     <div className="block p-1" onClick={() => { navTrigger() }}>
//                         <span className="block w-24-px border-3-top" style={{ marginTop: "4px" }} />
//                         <span className="block w-24-px border-3-top" style={{ marginTop: "4px" }} />
//                         <span className="block w-24-px border-3-top" style={{ marginTop: "4px" }} />
//                     </div>
//                 </div>
//                 <div className="w-100-pct order-1">
//                     {/* <img className="w-84-px block ml-auto m-r-1" src="/assets/image/mylan.png"/> */}
//                 </div>
//             </div>
//             <div className="m-t-2">
//                 {urls.map(url =>
//                     <div onClick={() => { window.location = url.url }} className={`flex flex-no-wrap m-t-0-5 pointer hover ${url.id === highlight ? "highlight" : ""}`} key={url.id}>

//                         <div className="w-72-px pointer order-0">
//                             <div className="block p-0-5">
//                                 <img className="w-24-px block mg-auto m-l-0-5" src={`/assets/icon/navbar/${url.icon}`} />

//                             </div>
//                         </div>
//                         <div className="w-100-pct p-0-5 order-1">
//                             <span className="text-16-px block p-l-0-5">{url.label}</span>
//                         </div>
//                     </div>
//                 )}

//                 {pages.map(page =>

//                     <div onClick={() => { openTab(`/fetch/${page.param}`) }} className={`flex flex-no-wrap m-t-0-5 pointer hover ${page_param === page.param ? "highlight" : ""}`} key={page.id}>

//                         <div className="w-72-px pointer order-0">
//                             <div className="block p-0-5">
//                                 <img className="w-24-px block mg-auto m-l-0-5" src="/assets/icon/navbar/ui.png" />
//                             </div>
//                         </div>
//                         <div className="w-100-pct p-0-5 order-1">
//                             <span className="text-16-px block p-l-0-5">{page.title} </span>
//                         </div>
//                     </div>

//                 )}

//             </div>

//             <div className="abs b-0 l-0 w-100-pct">
//                 {/* { bottomUrls.map( url =>
//                 <div onClick={ () => { window.location = url.url } } className={`flex flex-no-wrap m-t-0-5 pointer hover ${ url.id === highlight ? "login-bg": "" }`} key ={ url.id }>
//                     <div className="w-72-px pointer order-0">
//                         <div className="block p-0-5">
//                             <img className="w-24-px block mg-auto m-l-0-5" src={`/assets/icon/navbar/${url.icon}`}/>
//                         </div>
//                     </div>
//                     <div className="w-100-pct p-0-5 order-1">
//                         <span className="text-16-px block p-l-0-5">{url.label}</span>
//                     </div>
//                 </div>
//             )} */}
//             </div>

//         </div>
//     )
// }
