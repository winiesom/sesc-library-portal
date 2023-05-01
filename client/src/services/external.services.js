import axios from "axios";


const generateAnInvoice = (invoiceData) => axios.post("http://localhost:8083/invoices", invoiceData);


const externalService = {
    generateAnInvoice
};

export default externalService;
