import React, { useEffect, useState } from 'react';
import '../historique/Historique.css';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import 'jspdf-autotable';

const F12 = ({ lightMode }) => {
  const [historiqueData, setHistoriqueData] = useState([]);
  const [beneficiaryData, setBeneficiaryData] = useState([]);
  const [groupBy, setGroupBy] = useState('agence');
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfContent, setPdfContent] = useState('');
  const [selectedAgence, setSelectedAgence] = useState(null);

  useEffect(() => {
    fetchHistoriqueData();
    fetchBeneficiaryData();
  }, []);

  const fetchHistoriqueData = async () => {
    try {
      const response = await fetch('http://localhost:8081/envoi');
      const data = await response.json();
      setHistoriqueData(data);
    } catch (error) {
      console.error('Error fetching historique data:', error);
    }
  };

  const fetchBeneficiaryData = async () => {
    try {
      const response = await fetch('http://localhost:8081/benefs');
      const data = await response.json();
      setBeneficiaryData(data);
    } catch (error) {
      console.error('Error fetching beneficiary data:', error);
    }
  };

  const organizeHistoriqueDataByBeneficiaryAddress = () => {
    const organizedData = {};

    historiqueData.forEach((envoi) => {
      const beneficiaryName = envoi.Env_dest;
      const beneficiaryAddress = getBeneficiaryAddress(beneficiaryName);

      if (!organizedData[beneficiaryAddress]) {
        organizedData[beneficiaryAddress] = [];
      }

      organizedData[beneficiaryAddress].push(envoi);
    });

    return organizedData;
  };

  const organizeHistoriqueDataByAgence = () => {
    const organizedData = {};

    historiqueData.forEach((envoi) => {
      const agence = envoi.Env_agence_depot;

      if (!organizedData[agence]) {
        organizedData[agence] = [];
      }

      organizedData[agence].push(envoi);
    });

    return organizedData;
  };

  const getBeneficiaryAddress = (beneficiaryName) => {
    const beneficiary = beneficiaryData.find((b) => b.Ben_Nom === beneficiaryName);
    return beneficiary ? beneficiary.Ben_Addresse : '';
  };

  const organizedData = groupBy === 'address' ? organizeHistoriqueDataByBeneficiaryAddress() : organizeHistoriqueDataByAgence();

  const handlePreviewPDF = (groupKey) => {
    const pdf = new jsPDF();
    const titleText = 'Feuille d\'expedition des chargements du centre d\'ANTANANARIVO TRI';
    const descriptionText = 'VD des objets charges, lettres et paquets recommande, recouvrement - en precisant les envois contre remboursement';
  
    const maxWidthPercentage = 0.6;
  
    const titleFontSize = 16;
    const descriptionFontSize = 11;
  
    const maxTitleWidth = pdf.internal.pageSize.getWidth() * maxWidthPercentage;
    const maxDescriptionWidth = pdf.internal.pageSize.getWidth() * maxWidthPercentage;
  
    const titleLines = pdf.splitTextToSize(titleText, maxTitleWidth);
    const descriptionLines = pdf.splitTextToSize(descriptionText, maxDescriptionWidth);
  
    const titleY = 15;
    const descriptionY = titleY + titleLines.length * titleFontSize - 18;
  
    pdf.setFontSize(titleFontSize);
    pdf.text(titleLines, pdf.internal.pageSize.getWidth() / 2, titleY, { align: 'center' });
  
    pdf.setFontSize(descriptionFontSize);
    const lineHeight = -5;
  
    descriptionLines.forEach((line, index) => {
      pdf.text(line, pdf.internal.pageSize.getWidth() / 2, descriptionY + index * (descriptionFontSize + lineHeight), { align: 'center' });
    });
  
    const recapTitleWidth = 125.5;
    pdf.autoTable({
      startY: descriptionY + descriptionLines.length * descriptionFontSize - 10,
      head: [['                                         Récapitulation(en chiffre)']],
      headStyles: { fillColor: 'white', textColor: 'black', lineColor: 'black', lineWidth: 1 },
      bodyStyles: { lineWidth: 1 },
      tableWidth: recapTitleWidth,
      margin: { horizontal: (pdf.internal.pageSize.getWidth() - recapTitleWidth) / 2 },
    });
    const leftCircleX = 20;
    const leftCircleY = pdf.autoTable.previous.finalY + 5;
    const leftCircleRadius = 15;
    pdf.circle(leftCircleX, leftCircleY, leftCircleRadius);
    pdf.text('Timbre expediteur', leftCircleX, leftCircleY - leftCircleRadius - 2, { align: 'center' });

    const rightCircleX = pdf.internal.pageSize.getWidth() - 20;
    const rightCircleY = pdf.autoTable.previous.finalY + 5;
    const rightCircleRadius = 15;
    pdf.circle(rightCircleX, rightCircleY, rightCircleRadius);
    pdf.text('Timbre destinataire', rightCircleX, rightCircleY - rightCircleRadius - 2, { align: 'center' });

    const recapColumns = ['VD', 'LR', 'PR', 'Recouvrement', 'Objets Signalés'];
  
    let lineCount =organizedData[groupKey].length;
  
    const recapData = Array.from({ length: 1 }).map(() => ['', `${lineCount}`, '', '', '']);
  
    pdf.autoTable({
      startY: pdf.autoTable.previous.finalY + 0,
      head: [recapColumns],
      body: recapData,
      headStyles: { fillColor: 'white', textColor: 'black', lineColor: 'black', lineWidth: 1 },
      bodyStyles: { lineWidth: 1 },
      tableWidth: pdf.internal.pageSize.getWidth() * 0.60,
      columnStyles: {
        0: { cellWidth: pdf.internal.pageSize.getWidth() * 0.10 },
        1: { cellWidth: pdf.internal.pageSize.getWidth() * 0.10 },
        2: { cellWidth: pdf.internal.pageSize.getWidth() * 0.10 },
        3: { cellWidth: pdf.internal.pageSize.getWidth() * 0.15 },
        4: { cellWidth: pdf.internal.pageSize.getWidth() * 0.15 },
      },
      margin: { horizontal: (pdf.internal.pageSize.getWidth() - pdf.internal.pageSize.getWidth() * 0.60) / 2 },
    });
  
    pdf.text('', pdf.internal.pageSize.getWidth() / 2, pdf.autoTable.previous.finalY + 10);
  
    const agenceText = `Bureau d'origine: ${groupKey}`;
    pdf.text(agenceText, pdf.internal.pageSize.getWidth() / 2, pdf.autoTable.previous.finalY + 10, { align: 'center' });
  
    pdf.autoTable({
      startY: pdf.autoTable.previous.finalY + 20,
      head: [
        ["numero d'ordre", 'Expediteur', 'Destinataire', 'Lieux de destination', 'Num', 'Date', 'Montant'],
      ],
      body: organizedData[groupKey].map((envoi, index) => {
        return [
          index + 1,
          envoi.Env_exp,
          envoi.Env_dest,
          getBeneficiaryAddress(envoi.Env_dest),
          envoi.Env_num,
          envoi.Env_date_depot ? format(new Date(envoi.Env_date_depot), 'MM/dd/yyyy', { timeZone: 'Africa/Nairobi' }) : '',
          `${envoi.Env_taxe} Ar`,
        ];
      }),
      headStyles: { fillColor: 'white', textColor: 'black', lineColor: 'black', lineWidth: 1 },
      bodyStyles: { lineWidth: 1 },
    });
  
    recapData[0][1] = `${lineCount}`;
  
    const dataUri = pdf.output('datauristring');
    const newWindow = window.open();
    newWindow.document.write('<iframe width="100%" height="100%" src="' + dataUri + '"></iframe>');
  };
  
  return (
    <div className={`F12-container ${lightMode ? 'light-mode' : ''}`}>
      <div className='history-header'>
        <h1>Liste des envoi</h1>
        <div className='sorting metho'></div>
      </div>
  
      <div className='main-history-container'>
        <div className='agence-sidebar'>
        <h3>liste des agences: </h3>
          {Object.keys(organizedData).map((groupKey) => (
            <div key={groupKey} className='agence-item'>    
              <div className='agence-menu' onClick={() => setSelectedAgence(groupKey)}>
                {`${groupKey} (${
                  organizedData[groupKey].length !== 1
                    ? `nombre de depots: ${organizedData[groupKey].length}`
                    : 'nombre de depot: 1'
                })`}
              </div>
            </div>
          ))}
        </div>
  
        {selectedAgence ? (
          <div className='historique-list'>
            <h2 className='agenceH2'>{`Agence: ${selectedAgence} (${
              organizedData[selectedAgence].length !== 1
                ? `nombre de depots: ${organizedData[selectedAgence].length}`
                : 'nombre de depot: 1'
            })`}</h2>
            <button className = 'pdf-generation' onClick={() => handlePreviewPDF(selectedAgence)}>Generer liste F12</button>
  
            <div className='grouping'>
              {organizedData[selectedAgence].map((envoi) => (
                <div key={envoi.Env_id} className='historique-item'>
                  <p>
                    <strong>Expediteur</strong> {envoi.Env_exp}
                    <span className='separator'> | </span>
                    <strong>Destinataire</strong> {envoi.Env_dest}
                  </p>
                  <span>&nbsp;</span>
                  <p>
                    <strong>Details:</strong> {`Num: ${envoi.Env_num}, Poids: ${envoi.Env_poids}g , Taxe: ${envoi.Env_taxe} Ar `}
                  </p>
                  <span>&nbsp;</span>
                  <p>
                    <strong>Date:</strong>{' '}
                    {envoi.Env_date_depot &&
                      new Date(envoi.Env_date_depot).toLocaleDateString('en-US', {
                        timeZone: 'Africa/Nairobi',
                      })}
                    <span className='separator'> | </span>
                    <strong>{groupBy === 'address' ? 'Agence' : 'Address'}:</strong>{' '}
                    {groupBy === 'address' ? envoi.Env_agence_depot : getBeneficiaryAddress(envoi.Env_dest)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='historique-list'>
            {Object.keys(organizedData).map((groupKey) => (
              <div key={groupKey} className='grouping'>
                <h2>
                  {`${groupBy === 'address' ? 'Address' : 'Agence'}: ${groupKey} (${
                    organizedData[groupKey].length !== 1
                      ? `nombre de depots: ${organizedData[groupKey].length}`
                      : 'nombre de depot: 1'
                  })`}
                </h2>
                <button className = 'F12-btn' onClick={() => handlePreviewPDF(groupKey)}>Generer liste F12</button>
                {organizedData[groupKey].map((envoi) => (
                  <div key={envoi.Env_id} className='historique-item'>
                    <p>
                      <strong>Expediteur</strong> {envoi.Env_exp}
                      <span className='separator'> | </span>
                      <strong>Destinataire</strong> {envoi.Env_dest}
                    </p>
                    <span>&nbsp;</span>
                    <p>
                      <strong>Details:</strong> {`Num: ${envoi.Env_num}, Poids: ${envoi.Env_poids}g , Taxe: ${envoi.Env_taxe} Ar `}
                    </p>
                    <span>&nbsp;</span>
                    <p>
                      <strong>Date:</strong>{' '}
                      {envoi.Env_date_depot &&
                        new Date(envoi.Env_date_depot).toLocaleDateString('en-US', {
                          timeZone: 'Africa/Nairobi',
                        })}
                      <span className='separator'> | </span>
                      <strong>{groupBy === 'address' ? 'Agence' : 'Address'}:</strong>{' '}
                      {groupBy === 'address' ? envoi.Env_agence_depot : getBeneficiaryAddress(envoi.Env_dest)}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
  
      {showPdfPreview && (
        <div className="pdf-preview-section">
          <iframe title="PDF Preview" src={pdfContent} width="100%" height="600px" />
          <button onClick={() => setShowPdfPreview(false)}>Close Preview</button>
        </div>
      )}
    </div>
  );
  
};

export default F12;