import { isAddress, formatEther, EtherscanProvider } from "ethers"; 
 
const provider = new EtherscanProvider("mainnet", process.env.ETHERSCAN_API_KEY);
 
export function initApp() { 
    const walletInput = document.getElementById("wallet-address") as HTMLInputElement; 
    const balanceDisplay = document.getElementById("balance") as HTMLParagraphElement; 
    const transactionsDisplay = document.getElementById("transactions") as HTMLDivElement; 
    const checkBalanceButton = document.getElementById("check-balance") as HTMLButtonElement; 
    const checkTransactionsButton = document.getElementById("check-transactions") as HTMLButtonElement; 
 
    checkBalanceButton.addEventListener("click", async () => { 
        const address = walletInput.value.trim().normalize("NFKC");
        if(!address.startsWith("0x") || !/^[0-9a-fA-FxX]^/.test(address)) {
            balanceDisplay.textContent = "Endereço inválido!"; 
            return; 
        }
        if (!isAddress(address)) { 
            balanceDisplay.textContent = "Endereço inválido!"; 
            return; 
        } 
 
        try { 
            const balance = await provider.getBalance(address); 
            balanceDisplay.textContent = `Saldo: ${formatEther(balance)} ETH`; 
        } catch (error) { 
            balanceDisplay.textContent = "Erro ao buscar o saldo."; 
            console.error(error); 
        } 
    }); 
 
    checkTransactionsButton.addEventListener("click", async () => { 
        const address = walletInput.value.trim(); 
        if(!address.startsWith("0x")) {
            transactionsDisplay.textContent = "Endereço inválido!"; 
            return; 
        }
        if (!isAddress(address)) { 
            transactionsDisplay.textContent = "Endereço inválido!"; 
            return; 
        } 
 
        try {
            const apiKey = provider.apiKey ? provider.apiKey : "YourApiKeyToken";
            const url = `https://api.etherscan.io/v2/api?chainid=1&action=txlist&module=account&address=${address}&apikey=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data)
            if (data.status !== "1" || !data.result) {
                transactionsDisplay.textContent = "Nenhuma transação encontrada.";
                return;
            }
            transactionsDisplay.innerHTML = "<h3>Últimas Transações:</h3>";
            data.result.forEach((tx: any) => {
                const txElement = document.createElement("p");
                const dateTime = new Date(tx.timeStamp * 1000)
                const dateBR = dateTime.toLocaleDateString("pt-BR")
                const timeBR = dateTime.toLocaleTimeString("pt-BR")
                
                txElement.textContent = `Data: ${dateBR} Hora: ${timeBR} | De: ${tx.from} Para: ${tx.to} - Valor: ${formatEther(tx.value)} ETH`;
                transactionsDisplay.appendChild(txElement);
            });
        } catch (error) {
            transactionsDisplay.textContent = "Erro ao buscar as transações.";
            console.error(error);
        }
    }); 
}