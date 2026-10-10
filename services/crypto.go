package services

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/base64"
	"encoding/pem"
	"errors"
	"fmt"
	"math/big"
	"time"

	"software.sslmate.com/src/go-pkcs12"
)

type CryptoService struct{}

func NewCryptoService() *CryptoService {
	return &CryptoService{}
}

type CryptoResult struct {
	PrivateKey  string `json:"privateKey,omitempty"`
	PublicKey   string `json:"publicKey,omitempty"`
	Certificate string `json:"certificate,omitempty"`
	P12Base64   string `json:"p12Base64,omitempty"`
	Info        string `json:"info,omitempty"`
}

func (s *CryptoService) GenerateRSAKeyPair() (*CryptoResult, error) {
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return nil, fmt.Errorf("ошибка генерации ключа: %v", err)
	}
	privBlock := &pem.Block{Type: "RSA PRIVATE KEY", Bytes: x509.MarshalPKCS1PrivateKey(privateKey)}
	privPEM := pem.EncodeToMemory(privBlock)

	pubASN1, err := x509.MarshalPKIXPublicKey(&privateKey.PublicKey)
	if err != nil {
		return nil, err
	}
	pubBlock := &pem.Block{Type: "PUBLIC KEY", Bytes: pubASN1}
	pubPEM := pem.EncodeToMemory(pubBlock)

	return &CryptoResult{PrivateKey: string(privPEM), PublicKey: string(pubPEM)}, nil
}

func (s *CryptoService) CreateSelfSignedCert(commonName string, password string) (*CryptoResult, error) {
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return nil, err
	}

	serialNumber, _ := rand.Int(rand.Reader, new(big.Int).Lsh(big.NewInt(1), 128))
	template := x509.Certificate{
		SerialNumber: serialNumber,
		Subject: pkix.Name{
			CommonName:   commonName,
			Organization: []string{"Dev-Toolkit Auto-Generated"},
		},
		NotBefore:             time.Now(),
		NotAfter:              time.Now().AddDate(1, 0, 0),
		KeyUsage:              x509.KeyUsageKeyEncipherment | x509.KeyUsageDigitalSignature,
		ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		BasicConstraintsValid: true,
	}

	certDER, err := x509.CreateCertificate(rand.Reader, &template, &template, &privateKey.PublicKey, privateKey)
	if err != nil {
		return nil, fmt.Errorf("ошибка создания сертификата: %v", err)
	}

	certBlock := &pem.Block{Type: "CERTIFICATE", Bytes: certDER}
	certPEM := pem.EncodeToMemory(certBlock)

	privBlock := &pem.Block{Type: "RSA PRIVATE KEY", Bytes: x509.MarshalPKCS1PrivateKey(privateKey)}
	privPEM := pem.EncodeToMemory(privBlock)

	parsedCert, err := x509.ParseCertificate(certDER)
	if err != nil {
		return nil, err
	}

	p12Bytes, err := pkcs12.Encode(rand.Reader, privateKey, parsedCert, nil, password)
	if err != nil {
		return nil, fmt.Errorf("ошибка сборки P12: %v", err)
	}

	p12Base64Str := base64.StdEncoding.EncodeToString(p12Bytes)

	return &CryptoResult{
		PrivateKey:  string(privPEM),
		Certificate: string(certPEM),
		P12Base64:   p12Base64Str,
	}, nil
}

func (s *CryptoService) ParseCertificateInfo(certPEM string) (*CryptoResult, error) {
	block, _ := pem.Decode([]byte(certPEM))
	if block == nil || block.Type != "CERTIFICATE" {
		return nil, errors.New("неверный формат PEM сертификата")
	}
	cert, err := x509.ParseCertificate(block.Bytes)
	if err != nil {
		return nil, fmt.Errorf("ошибка парсинга: %v", err)
	}

	info := fmt.Sprintf("Субъект (Subject): %s\nИздатель (Issuer): %s\nСерийный номер: %x\nДействителен с: %s\nДействителен до: %s\nАлгоритм подписи: %s",
		cert.Subject.String(), cert.Issuer.String(), cert.SerialNumber, cert.NotBefore.Format("2006-01-02"), cert.NotAfter.Format("2006-01-02"), cert.SignatureAlgorithm.String())

	return &CryptoResult{Info: info}, nil
}
