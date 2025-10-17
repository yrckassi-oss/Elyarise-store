import type { OrderDetails } from '../types';

// This function assumes jsPDF is loaded from a CDN in index.html
declare const window: any;

export const generateInvoicePDF = (cart: OrderDetails[], paymentMethod: string) => {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const invoiceDate = new Date();
        const invoiceId = invoiceDate.getTime();
        const totalAmount = cart.reduce((sum, item) => sum + item.totalAmount, 0);
        const clientContact = cart.length > 0 ? cart[0].clientInfo.mainContact : 'N/A';

        // Header
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('ELYARISE CANAL+ STORE', 20, 20);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Facture', 150, 20);

        // Invoice Info
        doc.setFontSize(10);
        doc.text(`Facture N°: ${invoiceId}`, 150, 30);
        doc.text(`Date: ${invoiceDate.toLocaleDateString('fr-FR')}`, 150, 35);
        
        doc.text(`Client: ${clientContact}`, 20, 40);

        // Line separator
        doc.setLineWidth(0.5);
        doc.line(20, 50, 190, 50);

        // Table Header
        let yPosition = 60;
        doc.setFont('helvetica', 'bold');
        doc.text('Opération', 20, yPosition);
        doc.text('Détails', 70, yPosition);
        doc.text('Montant (F CFA)', 185, yPosition, { align: 'right' });

        // Table Rows
        doc.setFont('helvetica', 'normal');
        cart.forEach(item => {
            yPosition += 10;
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(item.type, 20, yPosition);
            
            let detailText = '';
            if (item.type === 'Réabonnement') {
                detailText = `${item.details.formule}, ${item.details.months} mois`;
            } else if (item.type === 'Modification de formule') {
                detailText = `${item.details.from} -> ${item.details.to}`;
            } else if (item.type === 'Demande de technicien') {
                detailText = `${item.details.service}`;
            } else {
                detailText = 'Réactivation';
            }

            doc.text(detailText, 70, yPosition);
            doc.text(item.totalAmount.toLocaleString('fr-FR'), 185, yPosition, { align: 'right' });
        });

        // Line separator
        yPosition += 10;
        doc.line(20, yPosition, 190, yPosition);

        // Total
        yPosition += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('Total à Payer:', 120, yPosition);
        doc.text(`${totalAmount.toLocaleString('fr-FR')} F CFA`, 190, yPosition, { align: 'right' });
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Moyen de paiement: ${paymentMethod}`, 20, yPosition + 10);
        
        // Footer
        yPosition = 280;
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Merci de votre confiance.', 105, yPosition, { align: 'center' });
        doc.text('© ELYARISE CANAL+ STORE', 105, yPosition + 5, { align: 'center' });

        doc.save(`facture-elyarise-${invoiceId}.pdf`);
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        alert("Impossible de générer la facture. Assurez-vous d'être connecté à internet.");
    }
};