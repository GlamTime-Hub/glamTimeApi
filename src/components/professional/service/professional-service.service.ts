import { ProfessionalService } from "../model/professional-service.model";

const addServiceToProfessional = async (service: any) => {
  return await ProfessionalService.create(service);
};

const removeServiceFromProfessional = async (service: string) => {
  return await ProfessionalService.findOneAndDelete({ service });
};

export { addServiceToProfessional, removeServiceFromProfessional };
