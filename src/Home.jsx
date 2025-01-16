import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
const Home = () => {
 const [count, setCount] = useState(localStorage.getItem('count'))

  const [name,setName]=useState('')
  const [password,setPassword]=useState('')

const submit =()=>{
  localStorage.setItem('name',name)
  localStorage.setItem('password',password)
  localStorage.setItem('count',count)
}

const reset =()=>{
    localStorage.setItem('count',0)
    localStorage.setItem('password','')
    localStorage.setItem('name','')
}

useEffect(() => {
  const selectedName = localStorage.getItem('name',name)
  const selectedPassword = localStorage.getItem('password',password)

  if (selectedName) {
    setName(selectedName)
  }
  else{
    setName('')
  }
  if (selectedPassword) {
    setPassword(selectedPassword)
  }
  else{
    setPassword('')
  }
}, []);

  const items=['Apple','Bananna','Orange']
  const numbers =[1,2,3,4]
  const even =numbers.filter(num=> num % 2 === 0)

    const [theme,setTheme]=useState('dark')

    const chooseTheme =(theme)=>{
      setTheme(theme)
      localStorage.setItem('theme',theme)
    }


    useEffect(() => {
      const selected = localStorage.getItem('theme')
      if (selected) {
        setTheme(selected)
      }
    }, []);

    const [allProducts,setAllProducts]=useState([])


    useEffect(() => {
        fetch('/data.json') // No '/public' in the path
          .then((response) => response.json())
          .then((json) => {
            setAllProducts(json);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }, []);
  

    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();
  
    const chooseProduct = (product) => {
      setSelectedProduct(product);
      navigate('/product', { state: { product } });
    };
  
    const goBack =()=>{
     navigate('/')
    }

 const [selectedType,setSelectedType]=useState(false)
 const [filteredProducts,setFilteredProducts]=useState([])

const chooseType =()=>{
    setSelectedType(true)
}

useEffect(() => {
    if (selectedType) {
        fetch('/data.json')
            .then((response) => response.json())
            .then((json) => {
                // Store all products in state
                setFilteredProducts(json);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }
}, [selectedType]); 

useEffect(() => {
    const filtered = filteredProducts.filter(product=>product.type ==='headphones')
    setFilteredProducts(filtered)
}, [allProducts,selectedType]);

    return ( 
        <div>
            <div className={`app `}>
            <div>
             
               
       
            </div>
            <h1>Vite + React</h1>
            <div className="flex">
              <button onClick={() => chooseTheme('light')}>Light</button>
              <button onClick={() => chooseTheme('dark')}>Dark</button>
            </div>
            <div className="card">
              <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </button>
              <button onClick={() => setCount(count + 1)}></button>
              <p>Edit <code>src/App.jsx</code> and save to test HMR</p>
            </div>
            <div className="read-the-docs flex">
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="text" />
            </div>
            <button onClick={submit}>Submit</button>
            <button onClick={reset}>reset</button>
            <button onClick={chooseType}>Headphones</button>
            <div className="flex">
              <p>{name}</p>
              <p>{password}</p>
            </div>
            {allProducts.map((product) => (
              <div  onClick={() => chooseProduct(product)} key={product.name}>
                <p>{product.name}</p>
                <p>{product.description}</p>
              </div>
            ))}
          {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                        <li key={index}>{product.name}</li>
                    ))
                ) : (
                    <li>No products available</li>
                )}
            
          </div>
        </div>
     );
}
 
export default Home;