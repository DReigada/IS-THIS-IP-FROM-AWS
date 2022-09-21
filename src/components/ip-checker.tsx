import React, { ChangeEvent, useEffect, useState } from 'react'; // we need this to make JSX compile

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAWS, setIsAWS] = useState(false);

  useEffect(() => {
    fetchData()
      .then(setData)
      .then(_ => setError(null))
      .catch((e) => {
        console.error(e)
        setError(e)
      })
      .finally(() =>
        setLoading(false)
      )
  }, []);

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const ip = e.target.value;

    if (!loading && ip_cidr.isValidAddress(ip)) {
      console.log("ASDFAS")

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

  return <>
    <span>
      <input type="text" placeholder="1.1.1.1" onChange={onNameChange} />
      {error &&
        <p style={{ color: "red" }}>{error.message}</p> ||
        <p>{isAWS ? "Is AWS" : "Is not AWS"}</p>}
    </span>
  </>
}
