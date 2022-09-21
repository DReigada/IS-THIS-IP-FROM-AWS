import React, { ChangeEvent, useEffect, useState } from 'react'; // we need this to make JSX compile
import './ip-checker.css'
import IPCIDR from 'ip-cidr';
import * as ip_cidr from 'ip-cidr';

interface Data {
  ipv4Cidrs: IPCIDR[],
  ipv6Cidrs: IPCIDR[],
}

async function fetchData(): Promise<Data> {
  const response = await fetch(`https://ip-ranges.amazonaws.com/ip-ranges.json`);
  const json = await response.json();

  return {
    ipv4Cidrs: json.prefixes.map((p: { [a: string]: string }) => new IPCIDR(p.ip_prefix)),
    ipv6Cidrs: json.ipv6_prefixes.map((p: { [a: string]: string }) => new IPCIDR(p.ipv6_prefix)),
  }
}

export const IpChecker = () => {
  const [data, setData] = useState<Data>({ ipv4Cidrs: [], ipv6Cidrs: [] });
  const [isAWS, setIsAWS] = useState(false);
  
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setFetching(true)
    fetchData()
      .then(setData)
      .then(_ => setError(null))
      .catch((e) => {
        console.error(e)
        setError(e)
      })
      .finally(() => {
        setFetching(false)
      }
      )
  }, []);

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const ip = e.target.value;

    if (!fetching && ip_cidr.isValidAddress(ip)) {
      const result = data.ipv4Cidrs.some(cidr => {
        const result = cidr.contains(ip);
        //console.log(result)
        result && setIsAWS(result)
        return result
      })

      console.log(result)
      setIsAWS(result)
    }
  }

  if (fetching) {
    return <p>fetching ip ranges...</p>
  } else if (error) {
    return <p style={{ color: "red" }}>{error.message}</p>
  } else {
    return <>
      <input className='ipInput' type="text" placeholder="IPv4 address" onChange={onNameChange} />
      <p>{isAWS ? "Yes!" : "No."}</p>
    </>
  }
}
