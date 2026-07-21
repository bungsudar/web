export const siteIdentity = {
  name: 'zu1k',
  url: 'https://zu1k.com',
  description: 'A boy dreaming of traveling around the world.',
  logo: 'https://zu1k.com/images/logo.jpg',
  pgp: {
    publicKeyUrl: 'https://pgp.zu1k.com',
    primaryFingerprint: '6A266AE018B6DD21C813150E4B9D09933F48F82D',
    primaryFingerprintDisplay: '6A26 6AE0 18B6 DD21 C813 150E 4B9D 0993 3F48 F82D',
    signingSubkeyFingerprint: '1CFBFD4F31F2780B28FAEB426CDDC150ABF9C46D',
    signingSubkeyFingerprintDisplay: '1CFB FD4F 31F2 780B 28FA EB42 6CDD C150 ABF9 C46D',
  },
} as const;

export const wallets = [
  { label: 'ETH', signedLabel: 'ETH', value: '0xbce82cd633c1dbd090297a286574be76af4deff6' },
  { label: 'BTC', signedLabel: 'BTC', value: 'bc1pkraanym8wck6zuc37nr3at9hxdvq29nx3spzuq7l20jc42qgpsqqgtvmlq' },
  { label: 'USDT · TRON', signedLabel: 'USDT(TRON)', value: 'TWQAP6CdEq6uVK5EAzZFya1dEUzt86qqmA' },
] as const;

export const signedWalletMessage = `-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

- - ETH:        0xbce82cd633c1dbd090297a286574be76af4deff6
- - BTC:        bc1pkraanym8wck6zuc37nr3at9hxdvq29nx3spzuq7l20jc42qgpsqqgtvmlq
- - USDT(TRON): TWQAP6CdEq6uVK5EAzZFya1dEUzt86qqmA

-----BEGIN PGP SIGNATURE-----

iQIzBAEBCAAdFiEEHPv9TzHyeAso+utCbN3BUKv5xG0FAmWzKCoACgkQbN3BUKv5
xG3MqQ//QIAolQSiHfosx2JS6c3M8p++ZcSTlxYXT7NTQ7r9HPqykExVok9L9Y0t
XdPyr31vDI+gqVzwyWJqokUdDiwQ9tcZmZjGz0SRGUHG+nb99meqzvPGMkFR2PN+
gSRWxeQmJUj5tWCrNNv50yZkouZ0wQacBji1/sWb3N9AMQPyB7EqYQ6WyisBmvsC
tpAfTYqgvINu9hexQKSk3/EFItt5xJZiLnxXHHZBcnlGZerVM1ELRK5zowdFQ1KU
Vzn2ByQ5JCtx3jusCaANQkWUPwgofZR5pfc3V+l4cUZbjTI3YgiCBQ+gKRIr/w2B
zH4KykcPDIeFgjwg9gV5norx/l5rMg+yzLmFfuWYbPof7xGfaUv9ZQ3L1FssxRNJ
am3SKNwMr4kakPiNWVgv6ecovwGL0dZbqmQuhOUt6CvewoB6BW7MBMe1QmigQMWV
kCmCaXfENrh0EKjAYdm4gLj1EodW3B4/16WUFXvuW8l1A1kLiQUMVMN5LM+l2DTn
K3ntvTbNdi1b5dIQvBCzinwpnKVoKd5kGh6Ld1+15SFw9NwMANN+LNUzYcqvrPx/
xw7NSsgLyWHwwq7lcg87AJXiYVMhdPrG89hVwv5X0+PewKy1MUkb8MqrSZn5EH+P
FQ0VZRm+5pfyP+arzEAUhTiyPfv76k+/o1xO60U0d5FFUmYi3bQ=
=ZijZ
-----END PGP SIGNATURE-----
`;

// Keep the human-readable wallet list and the signed record from silently drifting apart.
for (const wallet of wallets) {
  if (!signedWalletMessage.includes(wallet.value)) {
    throw new Error(`Wallet ${wallet.signedLabel} is missing from the signed identity record.`);
  }
}
