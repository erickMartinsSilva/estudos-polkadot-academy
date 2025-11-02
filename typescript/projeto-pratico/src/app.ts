import { isAddress, formatEther, EtherscanProvider } from "ethers";
import '../styles.css';

let currentAddress = ""
let currentPage = 1
const pageSize = 5

export function initApp() { 
    const walletInput = document.getElementById("wallet-address") as HTMLInputElement; 
    const balanceDisplay = document.getElementById("balance") as HTMLParagraphElement; 
    const transactionsDisplay = document.getElementById("transactions") as HTMLDivElement; 
    const checkBalanceButton = document.getElementById("check-balance") as HTMLButtonElement; 
    const checkTransactionsButton = document.getElementById("check-transactions") as HTMLButtonElement;
    const networkSelectInput = document.getElementById("networks") as HTMLInputElement
    const transactionsPageControlsDisplay = document.getElementById("transactions-controls") as HTMLDivElement 
    const nextPageButton = document.getElementById('next-page') as HTMLButtonElement
    const previousPageButton = document.getElementById('previous-page') as HTMLButtonElement

    const validateAddress = (address: string) => {
        return (
            (address.startsWith("0x") && /^[0-9a-fA-FxX]^/.test(address)) || isAddress(address)
        )
    }

    const fetchTransactions = async (address: string) => {
        const provider = new EtherscanProvider(networkSelectInput.value, process.env.ETHERSCAN_API_KEY);

        transactionsDisplay.style.display = 'block'
        transactionsPageControlsDisplay.style.display = 'none'
        transactionsDisplay.textContent = "Buscando transações..."

        const apiKey = provider.apiKey ? provider.apiKey : "YourApiKeyToken";
        const url = `https://api.etherscan.io/v2/api?chainid=1&action=txlist&module=account&address=${address}&page=${currentPage}&offset=${pageSize}&apikey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "1" || !data.result) {
            transactionsDisplay.textContent = "Nenhuma transação encontrada.";
            return;
        }

        transactionsPageControlsDisplay.style.display = 'flex'
        transactionsDisplay.innerHTML = "<h3>Últimas Transações:</h3>";
        data.result.forEach((tx: any) => {
            const txElement = document.createElement("p");
            const dateTime = new Date(tx.timeStamp * 1000)
            const dateBR = dateTime.toLocaleDateString("pt-BR")
            const timeBR = dateTime.toLocaleTimeString("pt-BR")

            txElement.innerHTML = 
                `<p>
                    <strong>Data</strong>: ${dateBR}, <strong>Hora</strong>: ${timeBR}<br/>
                    <strong>De</strong>: ${tx.from} <br/> 
                    <strong>Para</strong>: ${tx.to} <br/> 
                    <strong>Valor</strong>: ${formatEther(tx.value)} ETH
                </p>`;
            transactionsDisplay.appendChild(txElement);
        });
    }

    checkBalanceButton.addEventListener("click", async () => { 
        const provider = new EtherscanProvider(networkSelectInput.value, process.env.ETHERSCAN_API_KEY);

        const address = walletInput.value.trim().normalize("NFKC");
        if(!validateAddress(address)) {
            balanceDisplay.textContent = "Endereço inválido!"; 
            return; 
        }
        currentAddress = address
 
        try { 
            balanceDisplay.textContent = "Buscando saldo..."
            const balance = await provider.getBalance(address); 
            balanceDisplay.textContent = `Saldo: ${formatEther(balance)} ETH`; 
        } catch (error) { 
            balanceDisplay.textContent = "Erro ao buscar o saldo."; 
            console.error(error); 
        } 
    }); 
 
    checkTransactionsButton.addEventListener("click", async () => { 
        const address = walletInput.value.trim(); 
        if(!validateAddress(address)) {
            balanceDisplay.textContent = "Endereço inválido!"; 
            return; 
        }
        currentAddress = address
 
        try {
            fetchTransactions(address);
        } catch (error) {
            transactionsDisplay.textContent = "Erro ao buscar as transações.";
            console.error(error);
        }
    }); 

    previousPageButton.addEventListener("click", () => {
        if(currentPage > 1) {
            currentPage--
            fetchTransactions(currentAddress)
        }
    })

    nextPageButton.addEventListener("click", () => {
        currentPage++;
        fetchTransactions(currentAddress);
    })
}