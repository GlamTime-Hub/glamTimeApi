import { ProfessionalService } from "../model/professional-service.model";

const addServiceToProfessional = async (service: any) => {
  return await ProfessionalService.create(service);
};

const removeServiceFromProfessional = async (service: string) => {
  return await ProfessionalService.findOneAndDelete({ service });
};

const deleteProfessionalServices = async (
  professionalId: string,
  businessId: string
) => {
  return await ProfessionalService.deleteMany({
    professional: professionalId,
    business: businessId,
  });
};

export {
  addServiceToProfessional,
  removeServiceFromProfessional,
  deleteProfessionalServices,
};
