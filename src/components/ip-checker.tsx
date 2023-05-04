import React, { ChangeEvent, useEffect, useState } from 'react'; // we need this to make JSX compile
import ReactTooltip from 'react-tooltip';

import './ip-checker.css'
import IPCIDR from 'ip-cidr';
import * as ip_cidr from 'ip-cidr';

interface CidrData {
  cidr: IPCIDR,
  metadata: { [k: string]: string }
}
interface Data {
  ipv4Cidrs: CidrData[],
  ipv6Cidrs: CidrData[],
}

async function fetchData(): Promise<Data> {
  const response = await fetch(`https://ip-ranges.amazonaws.com/ip-ranges.json`);
  const json = await response.json();

  return {
    ipv4Cidrs: json.prefixes.map((p: { [a: string]: string }) => ({ cidr: new IPCIDR(p.ip_prefix), metadata: p })),
    ipv6Cidrs: json.ipv6_prefixes.map((p: { [a: string]: string }) => ({ cidr: new IPCIDR(p.ipv6_prefix), metadata: p }))
  }
}

export const IpChecker = () => {
  const [data, setData] = useState<Data>({ ipv4Cidrs: [], ipv6Cidrs: [] });
  const [isAWS, setIsAWS] = useState(false);
  const [ipInfo, setIpInfo] = useState<any>(<>nothing to see here</>);

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
        const result = cidr.cidr.contains(ip);
        //console.log(result)
        if (result) {
          setIsAWS(result)

          const ipInfo = Object.entries(cidr.metadata).map(([k, v]) => (
            <tr key={k}>
              <td>{k}</td>
              <td>{v}</td>
            </tr>
          ))

          setIpInfo(<table>
            <tbody>
              {ipInfo}
            </tbody>
          </table>)
        }
        return result
      })

      if(!result){
        setIsAWS(result)
        setIpInfo(<>nothing to see here</>)
      }
    }
  }

  if (fetching) {
    return <p>fetching ip ranges...</p>
  } else if (error) {
    return <p style={{ color: "red" }}>{error.message}</p>
  } else {
    return <>
      <input className='ipInput' type="text" placeholder="IPv4 address" onChange={onNameChange} />
      <p className='isit-text' data-tip=''>{isAWS ? "Yes!" : "No."}</p>
      <ReactTooltip place="bottom" type="dark" effect="solid">
        {ipInfo}
      </ReactTooltip>
    </>
  }
}
