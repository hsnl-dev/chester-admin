import React from 'react';
import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { CSVReader } from 'react-papaparse';
import { styled } from 'baseui';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'baseui/modal';
import moment from 'moment';

import Button from '../../components/Button/Button';
import { Text } from '../../components/DisplayTable/DisplayTable';
import { Grid } from '../../components/FlexBox/FlexBox';
import { ADDPURCHASING, PURCHASING } from '../../settings/constants';
import { request } from '../../utils/request';

const RowBox = styled('div', () => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: '10px',
  padding: '0px'
}));

const InputBox = styled('div', () => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginRight: '20px',
  marginLeft: '20px',
  marginTop: '10px',
}));

interface LocationState {
  vendor_id: string
};

const ImportPurchasing = () => {
  const [isOpenImport, setIsOpenImport] = useState(true);
  const [isUploading, setIsUploading] = useState(true);
  const [isOpenError, setIsOpenError] = useState(false);
  const [errorReason, setErrorReason] = useState("");
  const [importData, setImportData] = useState([]);
  const history = useHistory();
  const location = useLocation<LocationState>();

  const config = {
    skipEmptyLines: true,
    header: true,
    error: (err, file) => {
      console.log(err);
      setErrorReason("csv內容格式錯誤，請重新上傳");
      setIsOpenError(true);
    }
  }

  const closeImport = () => {
    setIsOpenImport(false);
    history.push(PURCHASING);
  }

  const closeError = () => {
    setIsOpenError(false);
    setErrorReason("");
  }

  const handleOnDrop = async (data, fileInfo) => {
    console.log('---------------------------');
    console.log(data);
    console.log(fileInfo);
    console.log('---------------------------');
    if (fileInfo.type !== 'text/csv' && fileInfo.type !== '.csv' && fileInfo.type !== 'application/vnd.ms-excel') {
      setErrorReason("檔案格式錯誤，請重新上傳");
      setIsOpenError(true);
    } else {
      setImportData(data);
      setIsUploading(false);
    }
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  }

  const handleOnRemoveFile = (data) => {
    console.log('---------------------------');
    console.log(data);
    console.log('---------------------------');
  };

  const importCSV = async () => {
    console.log(importData);
    const vendor_id = location.state.vendor_id;
    let commodities_arr = [];
    let errorExist = false;
    importData.forEach(element => {
      if (element.errors.length !== 0) {
        errorExist = true;
      }
    });

    if (errorExist) {
      setErrorReason("csv內容格式錯誤，請重新上傳");
      setIsOpenError(true);
    } else {
      importData.forEach(element => {
        commodities_arr.push({
          name: element.data.name,
          trace_no: element.data.trace_no,
          batch_no: element.data.batch_no,
          origin: element.data.origin,
          brand: element.data.brand,
          produce_period: element.data.produce_period,
          amount: element.data.amount,
          unit: element.data.unit,
          MFG: moment(element.data.MFG).format("YYYY-MM-DD"),
          EXP: moment(element.data.EXP).format("YYYY-MM-DD"),
          unit_price: element.data.unit_price,
          gross_price: element.data.gross_price,
          note: element.data.note
        });
      });

      if (commodities_arr.length !== 0) {
        try {
          const response = await request.post(`/commodity/create-multiple`, {
            commodities: commodities_arr,
            vendor_id: vendor_id
          });
    
          if (response.status === 200) {
            history.push(PURCHASING);
          } else {
            setErrorReason("系統發生錯誤，請重新上傳");
            setIsOpenError(true);
          }
        } catch (err) {
          console.log(err);
          setErrorReason("內容格式錯誤，請重新上傳");
          setIsOpenError(true);
        }
      } else {
        setErrorReason("內容格式錯誤，請重新上傳");
        setIsOpenError(true);
      }
    }
  }

  return (
    <Grid fluid={true}>
      <Modal onClose={closeError} isOpen={isOpenError}>
        <ModalHeader>匯入進貨</ModalHeader>
        <ModalBody>
          <Text>{errorReason}</Text>
        </ModalBody>
        <ModalFooter>
          <Button background_color={'#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={closeError}>確認</Button>
        </ModalFooter>
      </Modal>
      <Modal onClose={closeImport} isOpen={isOpenImport}>
        <ModalHeader>匯入進貨</ModalHeader>
        <ModalBody>
          <RowBox>
            <InputBox>
              <Text>匯入</Text>
              <CSVReader
                onDrop={handleOnDrop}
                onError={handleOnError}
                noDrag
                addRemoveButton
                onRemoveFile={handleOnRemoveFile}
                isReset={isOpenError}
                config={config}
                style={{
                  dropArea: {
                    borderColor: '#E6E6E6',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderRadius: 0
                  }
                }}
              >
                <span>點擊上傳</span>
              </CSVReader>
            </InputBox>
          </RowBox>
        </ModalBody>
        <ModalFooter>
          <Button background_color={'#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={closeImport}>取消</Button>
          <Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} disabled={isUploading} onClick={() => {importCSV()}}>匯入</Button>
        </ModalFooter>
      </Modal>
    </Grid>
  );
};

export default ImportPurchasing;