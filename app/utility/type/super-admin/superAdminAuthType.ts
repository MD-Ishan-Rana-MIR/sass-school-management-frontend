export interface SuperAdminLoginRequest {
    email: string
    password: string
}

export interface SuperAdminData {
    token: string
    role: "super-admin" | string // you can expand if there are other roles
}

// Type for the outer "data"
export interface SuperAdminDataWrapper {
    message: string
    data: SuperAdminData
}

// Full API response type
export interface SuperAdminLoginApiResponse {
    status: "success" | "error"
    message: string
    data: SuperAdminDataWrapper
}

export interface SuperAdminProfileType {

    name: string;
    email: string;
    role: string;
    img: string;  // fixed from `imag` to `image`
    createdAt: string;

}

