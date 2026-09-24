import { organisationIdParamDto, updateOrganisationDto } from "@/lib/types";
import { apiclient } from "./apiClient";
export class OrganisationApi {
  createOrganisation(payload: updateOrganisationDto) {
    return apiclient.post("/organisation", payload);
  }
  updateOrganisation(payload: updateOrganisationDto) {
    return apiclient.post("/organisation/update", payload);
  }
  getAllOrganisations() {
    return apiclient.get("/organisation");
  }
  getOrgById(id: organisationIdParamDto) {
    return apiclient.get("/organisation", {
      params: id,
    });
  }
}
