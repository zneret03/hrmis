import axios from 'axios';
import { axiosService } from '@/app/api/axios-client';
import {
  Certificates,
  CertificatesRequestForm,
} from '@/lib/types/certificates';
import { toast } from 'sonner';

export const getCertificates = async (params: string) => {
  try {
    const response = await axiosService.get(
      `/api/protected/documents${params}`,
    );

    return response.data.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
  }
};

export const requestDocument = async (data: CertificatesRequestForm) => {
  try {
    const response = await axiosService.post('/api/protected/documents', {
      data,
      type: 'request-document',
    });

    toast('Successfully', {
      description: response.data.message,
    });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
  }
};

export const updateDocument = async (
  data: Partial<Certificates>,
  id: string,
) => {
  try {
    const response = await axiosService.put(`/api/protected/documents/${id}`, {
      data,
      type: 'update-document',
    });

    toast('Successfully', {
      description: response.data.message,
    });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
  }
};

export const approveCustomDocument = async (docxBlob: Blob, id: string) => {
  try {
    const formData = new FormData();
    formData.append('docx', docxBlob, 'Document.docx');
    formData.append('certificateId', id);

    const response = await axiosService.post(
      '/api/protected/document_request/save',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    toast('Successfully', {
      description: response.data.message,
    });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data.error;
    }
  }
};
