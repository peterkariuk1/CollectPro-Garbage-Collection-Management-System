import loaderSVG from '../../assets/loader.svg'
const Loader = () => {
    return (
         <div className="flex items-center w-[99vw] h-[99vh] justify-center">
        <img className="w-[100px]" src={loaderSVG} alt="loading" />
      </div>
    )
}

export default Loader
