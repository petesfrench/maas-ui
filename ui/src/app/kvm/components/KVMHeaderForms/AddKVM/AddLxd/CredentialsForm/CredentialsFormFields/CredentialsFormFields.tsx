import { Col, Input, Row, Textarea } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { CredentialsFormValues } from "../../types";

import FormikField from "app/base/components/FormikField";
import ResourcePoolSelect from "app/base/components/ResourcePoolSelect";
import ZoneSelect from "app/base/components/ZoneSelect";
import type { SetKvmType } from "app/kvm/components/KVMHeaderForms/AddKVM";
import KvmTypeSelect from "app/kvm/components/KVMHeaderForms/AddKVM/KvmTypeSelect";
import { PodType } from "app/store/pod/types";

type Props = {
  generateCert: boolean;
  setGenerateCert: (generateCert: boolean) => void;
  setKvmType: SetKvmType;
};

export const CredentialsFormFields = ({
  generateCert,
  setGenerateCert,
  setKvmType,
}: Props): JSX.Element => {
  const { setFieldValue } = useFormikContext<CredentialsFormValues>();

  return (
    <Row>
      <Col size={6}>
        <KvmTypeSelect kvmType={PodType.LXD} setKvmType={setKvmType} />
      </Col>
      <Col size={6}>
        <FormikField label="Name" name="name" required type="text" />
        <ZoneSelect name="zone" required valueKey="id" />
        <ResourcePoolSelect name="pool" required valueKey="id" />
        <FormikField
          label="LXD address"
          name="power_address"
          required
          type="text"
        />
        <p>Authentication</p>
        <Input
          checked={generateCert}
          id="generate-certificate"
          label="Generate new certificate"
          onChange={() => {
            setGenerateCert(true);
            setFieldValue("certificate", "");
            setFieldValue("key", "");
          }}
          type="radio"
        />
        <Input
          checked={!generateCert}
          id="provide-certificate"
          label="Provide certificate and key"
          onChange={() => {
            setGenerateCert(false);
          }}
          type="radio"
        />
        {/*
          TODO: Build proper upload fields.
          https://github.com/canonical-web-and-design/app-squad/issues/244
        */}
        {!generateCert && (
          <>
            <FormikField
              component={Textarea}
              label="Certificate"
              name="certificate"
            />
            <FormikField component={Textarea} label="Private key" name="key" />
          </>
        )}
      </Col>
    </Row>
  );
};

export default CredentialsFormFields;