import ora, { type Ora } from 'ora'
import chalk from 'chalk'
import type { FastifyInstance } from 'fastify'
import os from 'node:os'

export interface BootstrapStep {
  name: string
  action: () => Promise<void> | void
  optional?: boolean
}

class BootstrapUI {
  private spinner: Ora | null = null
  private steps: BootstrapStep[] = []
  private currentStep = 0
  private startTime = Date.now()

  private colors = {
    primary: chalk.cyanBright,
    success: chalk.greenBright,
    error: chalk.redBright,
    warning: chalk.yellowBright,
    info: chalk.blueBright,
    dim: chalk.dim,
  }

  private formatTime(ms: number): string {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  private log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️',
    }

    const colors = {
      info: this.colors.info,
      success: this.colors.success,
      error: this.colors.error,
      warning: this.colors.warning,
    }

    console.log(`${icons[type]} ${colors[type](message)}`)
  }

  async executeStep(step: BootstrapStep): Promise<boolean> {
    const startTime = Date.now()
    this.currentStep++
    
    const stepLabel = `${this.currentStep}/${this.steps.length}`
    const prefix = this.colors.dim(`[${stepLabel}]`)
    
    this.spinner = ora({
      text: `${prefix} ${this.colors.primary(step.name)}...`,
      spinner: 'dots',
      color: 'cyan',
    }).start()

    try {
      await step.action()
      const duration = Date.now() - startTime
      this.spinner.succeed(
        `${prefix} ${this.colors.success(step.name)} ${this.colors.dim(`(${this.formatTime(duration)})`)}`
      )
      return true
    } catch (error: any) {
      const duration = Date.now() - startTime
      if (step.optional) {
        this.spinner.warn(
          `${prefix} ${this.colors.warning(step.name)} ${this.colors.dim(`(opcional - ${this.formatTime(duration)})`)}`
        )
        return true
      }
      this.spinner.fail(
        `${prefix} ${this.colors.error(step.name)} ${this.colors.dim(`(${this.formatTime(duration)})`)}`
      )
      this.log(`Erro: ${error.message}`, 'error')
      return false
    } finally {
      this.spinner = null
    }
  }

  async run(steps: BootstrapStep[]): Promise<boolean> {
    this.steps = steps
    this.currentStep = 0
    this.startTime = Date.now()

    // Header
    console.log('\n')
    console.log(this.colors.primary('╔═══════════════════════════════════════════════════════════╗'))
    console.log(this.colors.primary('║') + this.colors.info('           Iniciando Servidor Fastify') + this.colors.primary('                      ║'))
    console.log(this.colors.primary('╚═══════════════════════════════════════════════════════════╝'))
    console.log('')

    // Execute steps
    for (const step of steps) {
      const success = await this.executeStep(step)
      if (!success && !step.optional) {
        return false
      }
    }

    const totalTime = Date.now() - this.startTime
    console.log('')
    this.log(`Colocando o servidor em execução concluído em ${this.formatTime(totalTime)}`, 'success')
    console.log('')

    return true
  }

  showServerInfo(_fastify: FastifyInstance, port: number, host: string) {
    // Obter endereços de rede
    const networkInterfaces = os.networkInterfaces()
    const addresses: string[] = []
    
    // Coletar endereços IPv4
    for (const netInterface of Object.values(networkInterfaces)) {
      if (netInterface) {
        for (const iface of netInterface) {
          if (iface.family === 'IPv4' && !iface.internal) {
            addresses.push(iface.address)
          }
        }
      }
    }
    
    // Remover duplicatas
    const uniqueAddresses = Array.from(new Set(addresses))
    
    console.log('')
    console.log(this.colors.primary('╔═══════════════════════════════════════════════════════════╗'))
    console.log(`${this.colors.primary('║')}${this.colors.success('              ✅ Servidor em Execução')}${this.colors.primary('                      ║')}`)
    console.log(this.colors.primary('╠═══════════════════════════════════════════════════════════╣'))
    
    // Local URL
    const localUrl = `http://127.0.0.1:${port}`
    const localPadding = ' '.repeat(Math.max(0, 47 - localUrl.length))
    console.log(
      `${this.colors.primary('║')}  ${this.colors.info('Local:')}    ${this.colors.success(localUrl)}${localPadding}${this.colors.primary('║')}`
    )
    
    // Main URL (0.0.0.0 mostra como rede)
    if (host === '0.0.0.0') {
      const networkUrl = `http://${host}:${port}`
      const networkPadding = ' '.repeat(Math.max(0, 47 - networkUrl.length))
      console.log(
        `${this.colors.primary('║')}  ${this.colors.info('Rede:')}     ${this.colors.success(networkUrl)}${networkPadding}${this.colors.primary('║')}`
      )
    }
    
    // Additional network addresses (máximo 3 para não poluir)
    for (const addr of uniqueAddresses.slice(0, 3)) {
      const url = `http://${addr}:${port}`
      const padding = ' '.repeat(Math.max(0, 47 - url.length))
      console.log(
        `${this.colors.primary('║')}  ${this.colors.info('Rede:')}     ${this.colors.success(url)}${padding}${this.colors.primary('║')}`
      )
    }
    
    console.log(this.colors.primary('╠═══════════════════════════════════════════════════════════╣'))
    const healthUrl = `http://127.0.0.1:${port}/health`
    const healthPadding = ' '.repeat(Math.max(0, 23 - '/health'.length))
    console.log(
      `${this.colors.primary('║')}  ${this.colors.dim('Healthcheck:')} ${this.colors.info(healthUrl)}${healthPadding}${this.colors.primary('║')}`
    )
    console.log(this.colors.primary('╚═══════════════════════════════════════════════════════════╝'))
    console.log('')
    console.log(this.colors.dim('Pressione Ctrl+C para encerrar o servidor'))
    console.log('')
  }

  showError(message: string, error?: any) {
    console.log('')
    this.log(message, 'error')
    if (error) {
      console.log(this.colors.error(error.stack || error.message))
    }
    console.log('')
  }
}

export const bootstrapUI = new BootstrapUI()

