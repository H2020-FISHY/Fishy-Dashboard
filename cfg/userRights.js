// Must start with 1 to get the IRO tool
// The number must have a digit for each tool in fishyTools
// The 1 gives the right to use the tool for the user
//const IRO = 'https://10.4.34.136:30500/';

//const IRO = 'https://10.4.34.136:31005/';

//const XLSIEM = 'https://37.48.101.248:18080/xl-siem/login.php';

//const SACM = 'https://10.4.34.136:31006'; // STS

//const RAE = 'https://37.48.101.250/user_data/';

//const PMEM = 'https://10.4.34.136:31002/';

//const WAZUH = 'https://10.4.34.136:31003';

//const VAT = 'https://10.4.34.136:31003';

//const TRUST_Monitor = 'https://130.192.1.50:8080/';

const PMEM = process.env.PMEM || 'https://10.4.34.136:31002/';
const WAZUH = process.env.WAZUH || 'https://10.4.34.136:31003';
const XLSIEM = process.env.XLSIEM || 'https://37.48.101.248:18080/xl-siem/login.php';
const IRO = process.env.IRO || 'https://10.4.34.136:31005/';
const VAT = process.env.VAT || 'https://10.4.34.136:31006/';
const RAE = process.env.RAE || 'https://37.48.101.250/user_data/';
const TRUST_Monitor = process.env.TRUST_Monitor || 'https://10.4.34.136:31008/';
const SACM = process.env.SACM || 'https://10.4.34.136:31009/';

const fishyUsers = {
    fishy: [
	{
            tool: 1,
            name: 'IRO',
            uri: IRO
        },    
        {
            tool: 2,
            name: 'XL-SIEM',
            uri: XLSIEM
        },
        {
            tool: 3,
            name: 'RAE',
            uri: RAE
        },
        {
            tool: 4,
            name: 'WAZUH',
            uri: WAZUH
        },
        {
            tool: 5,
            name: 'VAT',
            uri: VAT
        },        
        {
             tool: 6,
             name: 'SACM',
             uri: SACM
         },
        {
            tool: 7,
            name: 'PMEM',
            uri: PMEM
        },
        {
            tool: 8,
            name: 'TRUST Monitor',
            uri: TRUST_Monitor
        },                 

    ], 	
    fishy_fa: [
        {
            tool: 1,
            name: 'IRO',
            uri: IRO
        },
        {
            tool: 2,
            name: 'SACM',
            uri: SACM
        },
        {
            tool: 3,
            name: 'WAZUH',
            uri: WAZUH
        },
        {
            tool: 4,
            name: 'VAT',
            uri: VAT
        },
        {
            tool: 5,
            name: 'PMEM',
            uri: PMEM
        },         
    ],
    fishy_wa: [
        {
            tool: 1,
            name: 'IRO',
            uri: IRO
        },
        {
            tool: 2,
            name: 'XL-SIEM',
            uri: XLSIEM
        },
        {
             tool: 3,
             name: 'SACM',
             uri: SACM
         },
        {
            tool: 4,
            name: 'RAE',
            uri: RAE
        },
    ],
    fishy_wu: [
        {
            tool: 1,
            name: 'IRO',
            uri: IRO
        },
        {
            tool: 2,
            name: 'XL-SIEM',
            uri: XLSIEM
        },
        {
            tool: 3,
            name: 'SACM',
            uri: SACM
        },
        {
            tool: 4,
            name: 'RAE',
            uri: RAE
        }
    ],
    fishy_su: [
        {
            tool: 1,
            name: 'IRO',
            uri: IRO
        },
        {
            tool: 3,
            name: 'SACM',
            uri: SACM
        },
        {
            tool: 4,
            name: 'RAE',
            uri: RAE
        },
    ],
    fishy_sa: [
        {
            tool: 1,
            name: 'IRO',
            uri: IRO
        },
        {
            tool: 2,
            name: 'SACM',
            uri: SACM
        },
    ],

    fishy_sb: [
        {
            tool: 1,
            name: 'IRO',
            uri: IRO
        },
        {
            tool: 2,
            name: 'SACM',
            uri: SACM
        },
        {
            tool: 4,
            name: 'TIM XL-SIEM',
            uri: XLSIEM
        }
        ,
        {
            tool: 5,
            name: 'RAE',
            uri: RAE
        },
        ,
        {
            tool: 2,
            name: 'TRUST Monitor',
            uri: TRUST_Monitor
        },
        
    ],

    fishy_sc: [
        {
            tool: 1,
            name: 'RAE',
            uri: RAE
        },
        {
            tool: 2,
            name: 'XL-SIEM',
            uri: XLSIEM
        },
    ],
    
}

export { fishyUsers }
