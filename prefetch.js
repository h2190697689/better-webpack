/**
 * 代码预加载
 */
window.onclick = function(){
    import( /* webpackPrefetch: true */ "./click.js").then(({default: func})=>{
        func()
    })
}



// click.js中内容
function handleClick(){
    const element = document.createElement("div");
    element.innerHTML = "hello min";
    document.body.appendChild(element)
}

export default handleClick