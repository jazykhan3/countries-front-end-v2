"use client";
import { Button, Select, Skeleton } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  letterOptions,
  numOfLettersOptions,
  genderOptions,
  birthYearsOptions,
  sortByOptions,
} from "./selectOptions";
import { useRouter, useSearchParams } from "next/navigation";
import BabyCard from "./countryCard";
import { CloseCircleOutlined } from "@ant-design/icons";
import CountryCard from "./countryCard";
import { FilterComponent } from "../filters";

const Main = () => {
  const [continents, setContinent] = useState('');
  const [languages, setLanguage] = useState('');
  const [currency, setCurrency] = useState('');
  const [borders, setBorder] = useState('');
  const [independent, setIndependent] = useState(null);
  const [UN_member, setUNMember] = useState(null);
  const [landlocked, setLandlocked] = useState(null);
  const [sort_category, setSortCategory] = useState('');
  const [sort_order, setSortOrder] = useState('');;
  const [countries, setCountries] = useState([]);
  const [loading,setLoading] =useState(true);

  const searchParams  = useSearchParams();
  console.log('slug_input',searchParams?.get('slug_input'))
  const slug = searchParams?.get('slug_input');

  useEffect(() => {
  
    const fetchCountries = async () => {
      try {
        setLoading(true);
        
        let requestBody = {};
  
        // Add slug_input to request body if it's present in the URL
        if (slug ) {
          requestBody.slug = slug;
        } else {
          // Prepare the request body with filters
          requestBody = {
            filter_params: {
              continents,
              languages,
              currency,
              borders,
              independent,
              UN_member,
              landlocked
            },
            sort_params: {
              sort_category,
              sort_order
            }
          };
    
        }
  
        // Remove null or undefined values from the request body
        requestBody = Object.fromEntries(
          Object.entries(requestBody).filter(([_, value]) => value != null)
        );
  
        const response = await fetch('https://countries-backend-y8w2.onrender.com/api/filter_names', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
  
        if (!response.ok) {
          setLoading(false);
          throw new Error('Failed to fetch data');
        }
  
        const data = await response.json();
        setCountries(data);
        setLoading(false);
  
      } catch (error) {
        setLoading(false);
        console.error('Error fetching data:', error);
      }
    };
  
    fetchCountries();
  }, [continents,languages,landlocked,currency,borders,independent,UN_member,sort_category,sort_order]);
  console.log('coun',countries)



  // Function to handle filter change
  const handleSelectValue = (filter, value) => {
    switch (filter) {
      case 'continents':
        setContinent(value);
        break;
      case 'languages':
        setLanguage(value);
        break;
      case 'currency':
        setCurrency(value);
        break;
      case 'borders':
        setBorder(value);
        break;
      case 'independent':
        setIndependent(value == 'Yes' ? 1 :value == null ? null : 0 );
        break;
      case 'UN_member':
        setUNMember(value == 'Yes' ? 1 :value == null ? null : 0 );
        break;
      case 'landlocked':
        setLandlocked(value == 'Yes' ? 1 :value == null ? null : 0 );
        break;
      case 'sort_category':
        setSortCategory(value);
        break;
      case 'sort_order':
        setSortOrder(value);
        break;
      default:
        break;
    }
  };

  // Function to clear all filters
  const clearFilter = () => {
    setContinent('');
    setLanguage('');
    setCurrency('');
    setBorder('');
    setIndependent(null);
    setUNMember(null);
    setLandlocked(null);
    setSortCategory('');
    setSortOrder('');
  };
  const dummyBabies = new Array(20).fill(null); // Create an array with 8 null elements for dummy cards
 
  return (
    <>
    
      <div className="flex flex-col gap-12 justify-start items-start py-6 px-4 bg-white">
        <div className="flex flex-col justify-start items-start gap-6">
          {/* Heading */}
         {loading ? <>                   <span className="h-[40px] w-full px-4 md:px-6 lg:px-16 xl:px-6"><Skeleton active title={{ width: "25%" }} paragraph={{rows:1}} /></span> 
  </> : <p className="text-[#0D121C] text-3xl font-bold leading-normal px-4 md:px-6 lg:px-24 xl:px-6">
{
   countries?.data?.title?.seo_title
}          </p>}

          {/* Select fields */}
         <FilterComponent 
          handleSelectValue={handleSelectValue}
          continents={continents}
          languages={languages}
          currency={currency}
          borders={borders}
          independent={independent}
          UN_member={UN_member}
          landlocked={landlocked}
          sort_category={sort_category}
          sort_order={sort_order}
          clearFilter={clearFilter} />
        </div>
        <div className="px-2 md:px-2 lg:px-2 xl:px-2 grid grid-cols-5 mx-auto gap-5">
        {loading
        ? dummyBabies.map((_, index) => <CountryCard key={index} loading={loading} />)
        : countries?.data?.countries?.length > 0 ? countries?.data?.countries?.map((country, index) => (
            <CountryCard key={index} country={country} loading={loading} />
          )):<div className="text-3xl font-bold text-center w-[70vw] mt-8">No Data Found</div>}
        </div>
      </div>
    </>
  );
};

export default Main;