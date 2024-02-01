import {AUDIENCE, buildApiUrl, buildError} from "./util";
import * as fs from 'fs';
import axios from "axios";
import FormData from 'form-data';
import * as core from "@actions/core";
import {UploadInputs} from "./upload-inputs";

const UTF = 'utf-8'

export function uploadFromActions(inputs: UploadInputs) {
    const fileContent = fs.readFileSync(inputs.file, UTF);
    const form = new FormData();
    form.append('file', fileContent);

    const tokenPromise = core.getIDToken(AUDIENCE)

    tokenPromise.then(token => {
            try {
                const {url, tool} = inputs
                axios.put(buildApiUrl(url, tool, 'upload'), form, {
                    headers: {
                        ...form.getHeaders(),
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then(response => {
                        if (response.status != 204) {
                            core.setFailed(`Failed response status: ${response.status}`);
                            return
                        }
                    })
                    .catch(error => buildError(error));
            } catch (error) {
                buildError(error);
            }
        }
    )
}
