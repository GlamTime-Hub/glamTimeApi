import { Contact, IContact } from "../model/contact.model";

const createContact = async (newContact: IContact) => {
  return await Contact.create(newContact);
};

export { createContact };
